from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    user_42_id = models.IntegerField(unique=True, null=True, blank=True)
    login_42 = models.CharField(max_length=15, null=True, blank=True)
    email_42 = models.EmailField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    campus = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.username

