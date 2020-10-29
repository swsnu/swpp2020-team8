from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    target_type = models.ForeignKey(
        ContentType,
        related_name='comment_target',
        blank=True,
        null=True,
        on_delete=models.CASCADE
    )
    target_id = models.IntegerField(blank=True, null=True)
    target = GenericForeignKey('target_type', 'target_id')
    content = models.TextField()
    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
