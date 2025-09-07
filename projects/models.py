from django.db import models


class Language(models.Model):
    LANGUAGE_CHOICES = [
        ("c", "C"),
        ("cpp", "C++"),
        ("python", "Python"),
        ("ocaml", "OCaml"),
        ("java", "Java"),
        ("compiled_languages", "Compiled Languages"),
        ("shell", "Shell"),
        ("php", "PHP"),
        ("csharp", "C#"),
        ("kotlin", "Kotlin"),
        ("swift", "Swift"),
        ("dart", "Dart"),
        ("zig", "Zig"),
        ("go", "Go"),
        ("assembly", "Assembly"),
        ("rust", "Rust"),
        ("undefined", "Undefined"),
    ]
    name = models.CharField(max_length=50, choices=LANGUAGE_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)

    def __str__(self):
        return self.display_name


class Specialization(models.Model):
    SPECIALIZATION_CHOICES = [
        ("common_core", "Common Core"),
        ("algo_ai_data", "Algo & AI & Data"),
        ("security", "Security"),
        ("devops", "Devops"),
        ("web_mobile", "Web & Mobile"),
        ("system_kernel", "System & Kernel"),
        ("graphics_gaming", "Graphics & Gaming"),
        ("crypto_maths", "Cryptography & Maths"),
        ("development", "Development"),
        ("professional_exp", "Professional Experience"),
    ]
    name = models.CharField(max_length=50, choices=SPECIALIZATION_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)

    def __str__(self):
        return self.display_name


class Project(models.Model):
    project_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)
    slug = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    difficulty = models.IntegerField(blank=True, null=True)
    parent_name = models.CharField(max_length=100, blank=True, null=True)
    objectives = models.JSONField(default=list, blank=True, null=True)
    estimate_time = models.IntegerField(blank=True, null=True)
    solo = models.BooleanField()
    xp_points = models.IntegerField(blank=True, null=True)
    prerequisites = models.JSONField(default=list, blank=True)
    subject_download_url = models.URLField(blank=True, null=True)
    languages = models.ManyToManyField(Language, blank=True)
    specializations = models.ManyToManyField(Specialization, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
