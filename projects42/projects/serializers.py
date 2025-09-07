from rest_framework import serializers
from .models import Project, Language, Specialization


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["name", "display_name"]


class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ["name", "display_name"]


class ProjectSerializer(serializers.ModelSerializer):
    languages = LanguageSerializer(many=True, read_only=True)
    specializations = SpecializationSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "project_id",
            "name",
            "slug",
            "description",
            "parent_name",
            "objectives",
            "estimate_time",
            "solo",
            "xp_points",
            "prerequisites",
            "subject_download_url",
            "languages",
            "specializations",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
