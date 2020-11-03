from django.core.validators import int_list_validator
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType


class User(AbstractUser):
    question_history = models.JSONField(null=True, validators=[int_list_validator(sep=',', allow_negative=True)])
    profile_image = models.FilePathField(default='/static/boo.jpg')
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)
