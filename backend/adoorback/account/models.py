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


class User(AbstractUser):
    """User Model
    This model extends the Django Abstract User model
    """
    email = models.EmailField(unique=True)
    question_history = models.CharField(null=True,
                                        # validators=[int_list_validator(sep=',',
                                        #                                allow_negative=True)])
                                        max_length=500)
    profile_pic = models.CharField(default=random_profile_color, max_length=7)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['username']

    @classmethod
    def are_friends(cls, user1, user2):
        return Friendship.objects.filter(user_id=user1.id, friend_id=user2.id).exists() | (user1 == user2)

    @property
    def type(self):
        return self.__class__.__name__


class Friendship(models.Model):
    """Friendship Model
    This model describes Friendship between users
    """
    user = models.ForeignKey(
        get_user_model(), related_name='friends', on_delete=models.CASCADE)
    friend = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)

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
    responder = models.ForeignKey(
        get_user_model(), related_name='received_friend_requests', on_delete=models.CASCADE)
    responded = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['requester', 'responder', ], name='unique_friend_request'),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.requester} sent to {self.responder} ({self.responded})'

    @property
    def type(self):
        return self.__class__.__name__


@receiver(post_save, sender=Friendship)
def create_reverse_friendship(sender, **kwargs):
    instance = kwargs['instance']
    user_id = instance.user_id
    friend_id = instance.friend_id
    try:
        sender.objects.get(user_id=friend_id, friend_id=user_id)
    except sender.DoesNotExist:
        sender.objects.create(user_id=friend_id, friend_id=user_id)
