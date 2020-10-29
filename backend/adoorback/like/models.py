from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType


class Like(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    target_type = models.ForeignKey(
        ContentType,
        related_name='like_target',
        blank=True,
        null=True,
        on_delete=models.CASCADE
    )
    target_id = models.IntegerField(blank=True, null=True)
    target = GenericForeignKey('target_type', 'target_id')
