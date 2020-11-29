from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save

from like.models import Like
from notification.models import Notification
from adoorback.models import AdoorModel
from adoorback.content_types import get_korean_type_name, get_comment_type

User = get_user_model()


class CommentManager(models.Manager):

    def comments_only(self, **kwargs):
        return self.exclude(content_type=get_comment_type(), **kwargs)

    def replies_only(self, **kwargs):
        return self.filter(content_type=get_comment_type(), **kwargs)


class Comment(AdoorModel):
    author = models.ForeignKey(User, related_name='comment_set', on_delete=models.CASCADE)
    is_private = models.BooleanField(default=False)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.IntegerField()
    target = GenericForeignKey('content_type', 'object_id')

    replies = GenericRelation('self')
    comment_likes = GenericRelation(Like)
    comment_targetted_notis = GenericRelation(Notification,
                                              content_type_field='target_type',
                                              object_id_field='target_id')
    comment_originated_notis = GenericRelation(Notification,
                                               content_type_field='origin_type',
                                               object_id_field='origin_id')

    objects = CommentManager()

    @property
    def type(self):
        return self.__class__.__name__

    @property
    def liked_user_ids(self):
        return self.comment_likes.values_list('user_id', flat=True)

    class Meta:
        base_manager_name = 'objects'


@receiver(post_save, sender=Comment)
def create_noti(sender, **kwargs):
    instance = kwargs['instance']
    target = instance
    origin = instance.target
    actor = instance.author
    user = instance.target.author
    origin_name = get_korean_type_name(origin.type)
    message = f'{actor.username}님이 회원님의 {origin_name}에 댓글을 남겼습니다.'
    Notification.objects.create(actor=actor, user=user, message=message,
                                origin=origin, target=target)
