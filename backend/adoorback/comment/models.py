from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.auth import get_user_model
from like.models import Like
from adoorback.models import AdoorModel
from adoorback.utils.content_types import get_content_type


User = get_user_model()


class CommentManager(models.Manager):
    use_for_related_fields = True

    def comments_only(self, **kwargs):
        return self.exclude(content_type=get_content_type("comment"), **kwargs)

    def replies_only(self, **kwargs):
        return self.filter(content_type=get_content_type("comment"), **kwargs)


class Comment(AdoorModel):
    author = models.ForeignKey(User, related_name='comment_set', on_delete=models.CASCADE)
    is_private = models.BooleanField(default=False)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.IntegerField(blank=True, null=True)
    target = GenericForeignKey('content_type', 'object_id')

    replies = GenericRelation('self')
    comment_likes = GenericRelation(Like)

    objects = CommentManager()

    @property
    def type(self):
        return self.__class__.__name__
