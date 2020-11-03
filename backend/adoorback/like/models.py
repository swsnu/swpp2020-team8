from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model


User = get_user_model()


class Like(models.Model):
    user = models.ForeignKey(User, related_name='liked_set', on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, related_name='like_set', on_delete=models.CASCADE)
    object_id = models.IntegerField(blank=True, null=True)
    target = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return f'{self.user} likes {self.content_type} ({self.object_id})'
