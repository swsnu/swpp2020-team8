from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.auth import get_user_model
from like.models import Like


User = get_user_model()


class Comment(models.Model):
    author = models.ForeignKey(User, related_name='commented_set', on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, related_name='comment_set', on_delete=models.CASCADE)
    object_id = models.IntegerField(blank=True, null=True)
    target = GenericForeignKey('content_type', 'object_id')
    content = models.TextField()
    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    replies = GenericRelation('self')
    likes = GenericRelation(Like)

    def __str__(self):
        return self.content
