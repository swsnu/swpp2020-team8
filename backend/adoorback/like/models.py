from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from adoorback.content_types import get_comment_type
from adoorback.models import AdoorTimestampedModel
from notification.models import Notification

User = get_user_model()


class LikeManager(models.Manager):
    use_for_related_fields = True

    def comment_likes_only(self, **kwargs):
        return self.filter(content_type=get_comment_type(), **kwargs)

    def feed_likes_only(self, **kwargs):
        return self.exclude(content_type=get_comment_type(), **kwargs)


class Like(AdoorTimestampedModel):
    user = models.ForeignKey(User, related_name='like_set', on_delete=models.CASCADE)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.IntegerField()
    target = GenericForeignKey('content_type', 'object_id')

    like_targetted_notis = GenericRelation(Notification,
                                           content_type_field='target_type',
                                           object_id_field='target_id')
    like_originated_notis = GenericRelation(Notification,
                                            content_type_field='origin_type',
                                            object_id_field='origin_id')
    objects = LikeManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'content_type', 'object_id'], name='unique_like'),
        ]

    def __str__(self):
        return f'{self.user} likes {self.content_type} ({self.object_id})'

    @property
    def type(self):
        return self.__class__.__name__


@receiver(post_save, sender=Like)
def create_like_noti(instance, **kwargs):
    user = instance.target.author
    actor = instance.user
    origin = instance.target
    target = instance

    if user == actor:  # do not create notification for liker him/herself.
        return
    actor_name = f'{actor.username}님이' if User.are_friends(user, actor) else '익명의 사용자가'

    if instance.target.type == 'Comment':  # if is reply
        message = f'{actor_name} 회원님의 댓글을 좋아합니다.'
        redirect_url = f'/{origin.target.type.lower()}s/{origin.target.id}'
    else:
        origin_target_name = ''
        if instance.target.type == 'Article':
            origin_target_name = '게시글'
        elif instance.target.type == 'Response':
            origin_target_name = '답변'
        elif instance.target.type == 'Question':
            origin_target_name = '질문'
        message = f'{actor_name} 회원님의 {origin_target_name}을 좋아합니다.'
        redirect_url = f'/{origin.type.lower()}s/{origin.id}'

    Notification.objects.create(actor=actor, user=user,
                                origin=origin, target=target,
                                message=message, redirect_url=redirect_url)
