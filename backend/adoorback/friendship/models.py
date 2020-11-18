import datetime
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.auth import get_user_model

from adoorback.models import AdoorModel


User = get_user_model()


class Friendship(AdoorModel):
    """ Model to represent Friendships """
    user = models.ForeignKey(
        User, related_name='friend_set', on_delete=models.CASCADE)
    friend = models.ForeignKey(
        User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user} is friends with {self.friend}'

    @property
    def type(self):
        return self.__class__.__name__
