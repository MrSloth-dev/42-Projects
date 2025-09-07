from django.contrib import admin
from .models import Project, Specialization, Language


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("display_name", "name")
    search_fields = ("display_name", "name")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "xp_points",
        "solo",
        "get_languages",
        "get_specializations",
    )
    filter_horizontal = ("languages", "specializations")
    search_fields = ("name", "slug", "description")
    readonly_fields = ("created_at", "updated_at")

    list_filter = ("solo", "specializations")

    fieldsets = (
        (
            "42 Project Data",
            {
                "fields": (
                    "project_id",
                    "name",
                    "slug",
                    "description",
                    "difficulty",
                    "parent_name",
                    "objectives",
                    "estimate_time",
                    "solo",
                    "xp_points",
                    "prerequisites",
                    "subject_download_url",
                )
            },
        ),
        (
            "Manual Data",
            {
                "fields": ("languages", "specializations"),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    def get_languages(self, obj):
        return ", ".join([lang.display_name for lang in obj.languages.all()])

    def get_specializations(self, obj):
        return ", ".join([spec.display_name for spec in obj.specializations.all()])

    get_languages.short_description = "Languages"
    get_specializations.short_description = "Specializations"

    actions = [
        "toggle_common_core",
        "toggle_algo_ai_data",
        "toggle_security",
        "toggle_devops",
        "toggle_web_mobile",
        "toggle_system_kernel",
        "toggle_graphics_gaming",
        "toggle_crypto_maths",
        "toggle_development",
        "toggle_professional_exp",
        # Language actions
        "toggle_c",
        "toggle_cpp",
        "toggle_python",
        "toggle_javascript",
        "toggle_typescript",
        "toggle_java",
        "toggle_ocaml",
        "toggle_compiled_languages",
        "toggle_shell",
        "toggle_php",
        "toggle_csharp",
        "toggle_kotlin",
        "toggle_swift",
        "toggle_dart",
        "toggle_zig",
        "toggle_go",
        "toggle_assembly",
        "toggle_rust",
        "toggle_undefined",
    ]

    # Specialization actions
    def toggle_common_core(self, request, queryset):
        spec = Specialization.objects.get(name="common_core")
        for project in queryset:
            if spec in project.specializations.all():
                project.specializations.remove(spec)
            else:
                project.specializations.add(spec)

    toggle_common_core.short_description = "Toggle Common Core"

    def toggle_algo_ai_data(self, request, queryset):
        spec = Specialization.objects.get(name="algo_ai_data")
        for project in queryset:
            if spec in project.specializations.all():
                project.specializations.remove(spec)
            else:
                project.specializations.add(spec)

    toggle_algo_ai_data.short_description = "Toggle Algo & AI & Data"

    def toggle_security(self, request, queryset):
        spec = Specialization.objects.get(name="security")
        for project in queryset:
            if spec in project.specializations.all():
                project.specializations.remove(spec)
            else:
                project.specializations.add(spec)

    toggle_security.short_description = "Toggle Security"

    def toggle_devops(self, request, queryset):
        spec = Specialization.objects.get(name="devops")
        for project in queryset:
            if spec in project.specializations.all():
                project.specializations.remove(spec)
            else:
                project.specializations.add(spec)

    toggle_devops.short_description = "Toggle Devops"

    def toggle_web_mobile(self, request, queryset):
        spec = Specialization.objects.get(name="web_mobile")
        for project in queryset:
            if spec in project.specializations.all():
                project.specializations.remove(spec)
            else:
                project.specializations.add(spec)

    toggle_web_mobile.short_description = "Toggle Web & Mobile"

    def toggle_system_kernel(self, request, queryset):
        spec = Specialization.objects.get(name="system_kernel")
        for project in queryset:
            if spec in project.specializations.all():
                project.specializations.remove(spec)
            else:
                project.specializations.add(spec)

    toggle_system_kernel.short_description = "Toggle System & Kernel"

    def toggle_graphics_gaming(self, request, queryset):
        spec = Specialization.objects.get(name="graphics_gaming")
        for project in queryset:
            if spec in project.specializations.all():
                project.specializations.remove(spec)
            else:
                project.specializations.add(spec)

    toggle_graphics_gaming.short_description = "Toggle Graphics & Gaming"

    def toggle_crypto_maths(self, request, queryset):
        spec = Specialization.objects.get(name="crypto_maths")
        for project in queryset:
            if spec in project.specializations.all():
                project.specializations.remove(spec)
            else:
                project.specializations.add(spec)

    toggle_crypto_maths.short_description = "Toggle Cryptography & Maths"

    def toggle_development(self, request, queryset):
        spec = Specialization.objects.get(name="development")
        for project in queryset:
            if spec in project.specializations.all():
                project.specializations.remove(spec)
            else:
                project.specializations.add(spec)

    toggle_development.short_description = "Toggle Development"

    def toggle_professional_exp(self, request, queryset):
        spec = Specialization.objects.get(name="professional_exp")
        for project in queryset:
            if spec in project.specializations.all():
                project.specializations.remove(spec)
            else:
                project.specializations.add(spec)

    toggle_professional_exp.short_description = "Toggle Professional Experience"

    # Language actions
    def toggle_c(self, request, queryset):
        lang = Language.objects.get(name="c")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_c.short_description = "Toggle C"

    def toggle_cpp(self, request, queryset):
        lang = Language.objects.get(name="cpp")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_cpp.short_description = "Toggle C++"

    def toggle_python(self, request, queryset):
        lang = Language.objects.get(name="python")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_python.short_description = "Toggle Python"

    def toggle_javascript(self, request, queryset):
        lang = Language.objects.get(name="javascript")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_javascript.short_description = "Toggle JavaScript"

    def toggle_typescript(self, request, queryset):
        lang = Language.objects.get(name="typescript")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_typescript.short_description = "Toggle TypeScript"

    def toggle_java(self, request, queryset):
        lang = Language.objects.get(name="java")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_java.short_description = "Toggle Java"

    def toggle_ocaml(self, request, queryset):
        lang = Language.objects.get(name="ocaml")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_ocaml.short_description = "Toggle OCaml"

    def toggle_compiled_languages(self, request, queryset):
        lang = Language.objects.get(name="compiled_languages")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_compiled_languages.short_description = "Toggle Compiled Languages"

    def toggle_shell(self, request, queryset):
        lang = Language.objects.get(name="shell")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_shell.short_description = "Toggle Shell"

    def toggle_php(self, request, queryset):
        lang = Language.objects.get(name="php")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_php.short_description = "Toggle PHP"

    def toggle_csharp(self, request, queryset):
        lang = Language.objects.get(name="csharp")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_csharp.short_description = "Toggle C#"

    def toggle_kotlin(self, request, queryset):
        lang = Language.objects.get(name="kotlin")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_kotlin.short_description = "Toggle Kotlin"

    def toggle_swift(self, request, queryset):
        lang = Language.objects.get(name="swift")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_swift.short_description = "Toggle Swift"

    def toggle_dart(self, request, queryset):
        lang = Language.objects.get(name="dart")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_dart.short_description = "Toggle Dart"

    def toggle_zig(self, request, queryset):
        lang = Language.objects.get(name="zig")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_zig.short_description = "Toggle Zig"

    def toggle_go(self, request, queryset):
        lang = Language.objects.get(name="go")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_go.short_description = "Toggle Go"

    def toggle_assembly(self, request, queryset):
        lang = Language.objects.get(name="assembly")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_assembly.short_description = "Toggle Assembly"

    def toggle_rust(self, request, queryset):
        lang = Language.objects.get(name="rust")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_rust.short_description = "Toggle Rust"

    def toggle_undefined(self, request, queryset):
        lang = Language.objects.get(name="undefined")
        for project in queryset:
            if lang in project.languages.all():
                project.languages.remove(lang)
            else:
                project.languages.add(lang)

    toggle_undefined.short_description = "Toggle Undefined"


@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ("display_name", "name")
    search_fields = ("display_name", "name")
