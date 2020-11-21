from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from adoorback.utils.content_types import get_content_type


User = get_user_model()


class FriendRequest(models.Model):
    """FriendRequest Model
    This model describes FriendRequest between users
    """
    actor = models.ForeignKey(
        User, related_name='sent_friend_request_set', on_delete=models.CASCADE)
    recipient = models.ForeignKey(
        User, related_name='received_friend_request_set', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.actor} sent friend request to {self.recipient}'

    @property
    def type(self):
        return self.__class__.__name__
