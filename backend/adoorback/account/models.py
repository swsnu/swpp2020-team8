from django.core.validators import int_list_validator
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    question_history = models.JSONField(null=True, validators=[int_list_validator(sep=',', allow_negative=True)])
    profile_image = models.FileField(upload_to='profile_pics', default='settings.MEDIA_ROOT/profile_pics/boo.jpg')
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)
