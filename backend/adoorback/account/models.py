"""Django Model
Define Models for account APIs
"""
import random

from django.apps import apps
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver

from adoorback.models import AdoorTimestampedModel


def random_profile_color():
    # use random int so that initial users get different colors
    return '#{0:06X}'.format(random.randint(0, 16777216))


class User(AbstractUser, AdoorTimestampedModel):
    """User Model
    This model extends the Django Abstract User model
    """
    email = models.EmailField(unique=True)
    question_history = models.CharField(null=True, max_length=500)
    profile_pic = models.CharField(default=random_profile_color, max_length=7)
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)

    class Meta:
        ordering = ['username']

    @classmethod
    def are_friends(cls, user1, user2):
        return user2.id in user1.friend_ids or user1 == user2

    @property
    def type(self):
        return self.__class__.__name__

    @property
    def friend_ids(self):
        return list(self.friends.values_list('id', flat=True))


class FriendRequest(AdoorTimestampedModel):
    """FriendRequest Model
    This model describes FriendRequest between users
    """
    requester = models.ForeignKey(
        get_user_model(), related_name='sent_friend_requests', on_delete=models.CASCADE)
    requestee = models.ForeignKey(
        get_user_model(), related_name='received_friend_requests', on_delete=models.CASCADE)
    accepted = models.BooleanField(null=True)

    friend_request_targetted_notis = GenericRelation("notification.Notification",
                                                     content_type_field='target_type',
                                                     object_id_field='target_id')
    friend_request_originated_notis = GenericRelation("notification.Notification",
                                                      content_type_field='origin_type',
                                                      object_id_field='origin_id')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['requester', 'requestee', ], name='unique_friend_request'),
        ]
        ordering = ['-updated_at']

    def __str__(self):
        return f'{self.requester} sent to {self.requestee} ({self.accepted})'

    @property
    def type(self):
        return self.__class__.__name__


@receiver(m2m_changed, sender=User)
def delete_friendship_noti(action, pk_set, instance):
    Notification = apps.get_model('notification', 'Notification')
    if action == "post_remove":
        friend = User.objects.get(id=pk_set.pop())
        Notification.objects.filter(user=instance, actor=friend,
                                    target=friend, origin__type='FriendRequest').delete()


@receiver(post_save, sender=FriendRequest)
def create_friend_noti(created, instance):
    accepted = instance.accepted
    Notification = apps.get_model('notification', 'Notification')
    if created:
        requestee = instance.requestee
        requester = instance.requester
        Notification.objects.create(user=requestee, actor=requester,
                                    origin=instance, target=instance,
                                    message=f'{requester.username}님이 친구 요청을 보냈습니다.',
                                    redirect_url=f'/user/{requester.id}')
    elif accepted:
        requester = instance.requester
        requestee = instance.requestee
        Notification.objects.create(user=requestee, actor=requester,
                                    origin=requester, target=instance,
                                    message=f'{requester.username}님과 친구가 되었습니다.',
                                    redirect_url=f'/user/{requester}')
        Notification.objects.create(user=requester, actor=requestee,
                                    origin=requestee, target=instance,
                                    message=f'{requestee.username}님과 친구가 되었습니다.',
                                    redirect_url=f'/user/{requestee.id}')
        # add friendship
        requester.friends.add(requestee)
    # recipient refused friend request
    else:
        requestee = instance.requestee
        requester = instance.requester
        # should be unique
        notification = Notification.objects.get(user=requestee, actor=requester,
                                                origin=instance, target=instance)
        notification.is_visible = False
        notification.save()
