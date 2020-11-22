from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from adoorback.utils.content_types import get_content_type
from notification.models import Notification

User = get_user_model()


class LikeManager(models.Manager):
    use_for_related_fields = True

    def comment_likes_only(self, **kwargs):
        return self.filter(content_type=get_content_type("Comment"), **kwargs)

    def feed_likes_only(self, **kwargs):
        return self.exclude(content_type=get_content_type("Comment"), **kwargs)


class Like(models.Model):
    user = models.ForeignKey(User, related_name='like_set', on_delete=models.CASCADE)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.IntegerField(blank=True, null=True)
    target = GenericForeignKey('content_type', 'object_id')

    like_targetted_notis = GenericRelation(Notification,
        content_type_field='target_type', object_id_field='target_id')
    like_originated_notis = GenericRelation(Notification,
        content_type_field='origin_type', object_id_field='origin_id')
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
def create_noti(sender, **kwargs):
    instance = kwargs['instance']
    target = instance
    origin = instance.target
    actor = instance.user
    recipient = instance.target.author
    message = f'{actor.username} likes your {origin.type}'
    Notification.objects.create(actor = actor, recipient = recipient, message = message,
            origin = origin, target = target, is_read = False, is_visible = True)
