"""Django Model
Define Models for account APIs
"""
import random

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

    class Meta:
        ordering = ['username']

    @classmethod
    def are_friends(cls, user1, user2):
        return Friendship.objects.filter(user_id=user1.id, friend_id=user2.id).exists() | (user1 == user2)

    @property
    def type(self):
        return self.__class__.__name__

    @property
    def friend_ids(self):
        return self.friends.values_list('id', flat=True)


class Friendship(AdoorTimestampedModel):
    """Friendship Model
    This model describes Friendship between users
    """
    user = models.ForeignKey(
        get_user_model(), related_name='friends', on_delete=models.CASCADE)
    friend = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE)

    objects = models.Manager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'friend', ], name='unique_friendship'),
        ]

    def __str__(self):
        return f'{self.user} & {self.friend}'

    @property
    def type(self):
        return self.__class__.__name__


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
    requester_id = instance.requester_id
    requestee_id = instance.requestee_id
    accepted = instance.accepted
    if accepted:
        Friendship.objects.create(user_id=requester_id, friend_id=requestee_id)
        Friendship.objects.create(user_id=requestee_id, friend_id=requester_id)
    else:
        return
