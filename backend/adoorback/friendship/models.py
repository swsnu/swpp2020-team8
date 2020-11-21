"""Django Model
Define Models for friendship APIs
"""

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Friendship(models.Model):
    """Friendship Model
    This model describes Friendship between users
    """
    user = models.ForeignKey(
        User, related_name='friend_set', on_delete=models.CASCADE)
    friend = models.ForeignKey(
        User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "friend",)

    def __str__(self):
        return f'{self.user} is friends with {self.friend}'

    @property
    def type(self):
        return self.__class__.__name__
