from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    question_history = models.JSONField(null=True)
    profile_image = models.FilePathField(default='/static/boo.jpg')
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)

