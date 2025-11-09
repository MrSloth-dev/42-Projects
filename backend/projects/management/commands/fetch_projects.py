from django.core.management.base import BaseCommand
from projects.models import Project, Specialization
from projects.services.api_client import API42Client


class Command(BaseCommand):
    help = "Fetch Projects from 42 API and save to database"

    # to remove
    def add_arguments(self, parser):
        parser.add_argument(
            "--cursus-id", type=int, default=21, help="Cursus ID to fetch projects from"
        )
        parser.add_argument(
            "--limit", type=int, help="limit number of projects to fetch"
        )
        parser.add_argument(
            "--debug", action="store_true", help="Create Debug Text Files"
        )

    def handle(self, *args, **options):
        client = API42Client()
        cursus_id = options["cursus_id"]
        limit = options["limit"]
        debug = options.get("debug", True)

        self.stdout.write(f"Fetching projects from cursus {cursus_id}")

        try:
            page = 1
            total_created = 0
            total_updated = 0

            if debug:
                with (
                    open("low_campus.txt", "w") as low,
                    open("maybe_beta.txt", "w") as beta,
                    open("not_subscritable.txt", "w") as subs,
                    open("forbidden_keyword.txt", "w") as forb,
                    open("not_pt.txt", "w") as pt,
                ):
                    while True:
                        params = {
                            "page": page,
                            "per_page": 100,
                        }
                        if limit and total_created + total_updated >= limit:
                            break
                        projects_data = client.get(
                            f"/v2/cursus/{cursus_id}/projects", params
                        )

                        if not projects_data:
                            break
                        for project_data in projects_data:
                            if not self._has_excluded_campus(project_data):
                                print(f"{project_data.get('slug', '')}", file=pt)
                            # Check beta and low campus projects
                            # 9 is the number of campuses that microsoft's projects have
                            if len(project_data.get("campus", [])) < 9:
                                if self._extract_subscriptable(project_data):
                                    print(f"{project_data.get('slug', '')}", file=beta)
                                else:
                                    print(
                                        f"{project_data.get('slug', '')}, {
                                            len(project_data.get('campus', []))
                                        }",
                                        file=low,
                                    )
                                continue
                            if self._should_skip_project(project_data):
                                print(
                                    f"{
                                        project_data.get('slug', '')
                                    }, forbidden keyword",
                                    file=forb,
                                )
                                continue
                            if not self._extract_subscriptable(project_data):
                                print(
                                    f"{project_data.get('slug', '')}, not subscritable",
                                    file=subs,
                                )
                                continue
                            created, updated = self._save_project(project_data)
                            if created:
                                total_created += 1
                            if updated:
                                total_updated += 1

                            if limit and total_created + total_updated >= limit:
                                break
                        page += 1
                        self.stdout.write(f"Processed page {page - 1}....")
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"Successfully processed projects: {
                                    total_created
                                } created, {total_updated} updated"
                            )
                        )
            else:
                while True:
                    params = {
                        "page": page,
                        "per_page": 100,
                    }
                    if limit and total_created + total_updated >= limit:
                        break
                    projects_data = client.get(
                        f"/v2/cursus/{cursus_id}/projects", params
                    )

                    if not projects_data:
                        break
                    for project_data in projects_data:
                        # Check beta and low campus projects
                        # 9 is the number of campuses that microsoft's projects have
                        if len(project_data.get("campus", [])) < 9:
                            continue
                        if self._should_skip_project(project_data):
                            continue
                        if not self._extract_subscriptable(project_data):
                            continue
                        created, updated = self._save_project(project_data)
                        if created:
                            total_created += 1
                        if updated:
                            total_updated += 1

                        if limit and total_created + total_updated >= limit:
                            break
                    page += 1
                    self.stdout.write(f"Processed page {page - 1}....")
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Successfully processed projects: {
                                total_created
                            } created, {total_updated} updated"
                        )
                    )
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error fetching projects: {str(e)}"))

    def _save_project(self, data):
        """Save or update project form API data"""
        specialization_name = self._get_specialization(data)
        defaults = {
            "name": data.get("name", ""),
            "slug": data.get("slug", ""),
            "description": self._extract_description(data),
            "difficulty": data.get("difficulty", 0),
            "parent_name": data.get("parent", {}).get("name")
            if data.get("parent")
            else None,
            "objectives": self._extract_objectives(data),
            "estimate_time": self._parse_estimate_time(data),
            "solo": self._determine_solo_status(data),
            "xp_points": self._calculate_xp_points(data),
            "prerequisites": self._extract_prerequisites(data),
            "subject_download_url": self._get_subject_url(data),
        }
        print(f"trying to save {defaults.get('slug', '')}")
        project, created = Project.objects.update_or_create(
            project_id=data["id"], defaults=defaults
        )
        if specialization_name == "Common Core":
            try:
                specialization = Specialization.objects.get(name="common_core")
                project.specializations.set([specialization])
            except Specialization.DoesNotExist:
                pass
        return created, not created

    def _parse_estimate_time(self, data):
        """Convert estimation string into hours integer"""
        sessions = data.get("project_sessions", [])
        if sessions:
            estimate_time = sessions[0].get("estimate_time", "")
            if not estimate_time:
                return 0
            try:
                return int(estimate_time.split()[0])
            except (ValueError, IndexError):
                return 0

    def _extract_description(self, data):
        """Extract description from project session"""
        sessions = data.get("project_sessions", [])
        if sessions:
            return sessions[0].get("description", "")
        return ""

    def _determine_solo_status(self, data):
        """Check if a project is solo or group"""
        sessions = data.get("project_sessions", [])
        if sessions:
            return sessions[0].get("solo", False)
        return False

    def _calculate_xp_points(self, data):
        return data.get("difficulty", 0)

    def _extract_prerequisites(self, data):
        return []

    def _extract_objectives(self, data):
        """Extract objectives from project sessions"""
        sessions = data.get("project_sessions", [])
        if sessions:
            return sessions[0].get("objectives", [])
        return []

    def _extract_subscriptable(self, data):
        """Extract is_subscriptable from project sessions"""
        sessions = data.get("project_sessions", [])
        return any(session.get("is_subscriptable", False) for session in sessions)

    def _get_subject_url(self, data):
        attachments = data.get("attachments", [])
        for attachment in attachments:
            if attachment.get("name", "").endswith(".pdf"):
                return attachment.get("url")
        return None

    def _get_specialization(self, data):
        slug = data.get("slug", "")

        # Common core projects
        common_core_slugs = [
            "libft",
            "get_next_line",
            "fractol",
            "FdF",
            "minitalk",
            "miniRT",
            "ft_printf",
            "born2beroot",
            "pipex",
            "minishell",
            "philosophers",
            "cub3d",
            "so-long",
            "netpractice",
            "cpp-module",
            "inception",
            "webserv",
            "ft_irc",
            "transcendence",
        ]

        for core_slug in common_core_slugs:
            if core_slug in slug:
                return "Common Core"
        return "42 Advanced"

    def _should_skip_project(self, data):
        """Skip projects with excluded keywords"""
        excluded_keywords = [
            "TEST",
            "RNCP",
            "Apprentissage",
            "Internship",
            "startup",
            "work-experience",
            "exam",
            "Rushes",
            "hive",
            "maillard",
            "42Québec",
            "42_collaborative_resume",
            "deprecated",
            "java",
            "part_time",
            "old",
            "Electronique",
            "abstract-vm",
            "ft_containers",
            "ft_script",
            "ft_select",
            "ft_server",
            "tinky-winkey",
            "gbmu",
        ]
        name = data.get("name", "").upper()
        slug = data.get("slug", "").upper()
        return any(
            keyword.upper() in name or keyword.upper() in slug
            for keyword in excluded_keywords
        )

    def _has_excluded_campus(self, data):
        """Check if project has excluded campus IDs (38: Lisboa, 58: Porto)"""
        campus_list = data.get("campus", [])
        excluded_campus_ids = [38, 58]  # Lisboa and Porto

        return any(campus.get("id") in excluded_campus_ids for campus in campus_list)
