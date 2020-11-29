"""Django Model
Define Models for account APIs
"""
import random

from django.apps import apps
from django.contrib.auth import get_user_model
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
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
    question_history = models.CharField(null=True,
                                        max_length=500)
    profile_pic = models.CharField(default=random_profile_color, max_length=7)
    friends = models.ManyToManyField('self',
                                     symmetrical=True,
                                     blank=True)

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


@receiver(post_save, sender=FriendRequest)
def create_friendship(sender, **kwargs):
    instance = kwargs['instance']
    requester = instance.requester
    requestee = instance.requestee
    accepted = instance.accepted
    if accepted:
        requester.friends.add(requestee)
    else:
        return


@receiver(post_save, sender=FriendRequest)
def create_friend_request_noti(sender, **kwargs):
    instance = kwargs['instance']
    accepted = instance.accepted
    Notification = apps.get_model('notification', 'Notification')
    if not accepted:
        actor = instance.requester
        user = instance.requestee
        origin = instance
        target = instance
        message = f'{actor.username}님이 친구 요청을 보냈습니다.'
        Notification.objects.create(actor=actor, user=user, message=message,
                                    origin=origin, target=target)
    else:
        actor = instance.requestee
        user = instance.requester
        origin = actor
        target = instance
        message = f'{actor.username}님과 친구가 되었습니다.'
        Notification.objects.create(actor=actor, user=user, message=message,
                                    origin=origin, target=target)
