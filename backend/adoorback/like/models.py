from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from adoorback.utils.content_types import get_content_type


User = get_user_model()


class LikeManager(models.Manager):
    use_for_related_fields = True

    def comment_likes_only(self, **kwargs):
        return self.exclude(content_type=get_content_type("comment"), **kwargs)

    def feed_likes_only(self, **kwargs):
        return self.filter(content_type=get_content_type("comment"), **kwargs)


class Like(models.Model):
    user = models.ForeignKey(User, related_name='like_set', on_delete=models.CASCADE)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.IntegerField(blank=True, null=True)
    target = GenericForeignKey('content_type', 'object_id')

    objects = LikeManager()

    def __str__(self):
        return f'{self.user} likes {self.content_type} ({self.object_id})'

    @property
    def type(self):
        return self.__class__.__name__
