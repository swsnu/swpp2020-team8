"""Django Model
Define Models for account APIs
"""


from django.core.validators import int_list_validator
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """User Model
    This model extends the Django Abstract User model
    """
    email = models.EmailField(unique=True)
    question_history = models.CharField(null=True,
                                        # validators=[int_list_validator(sep=',',
                                        #                                allow_negative=True)])
                                        max_length=500)
    profile_image = models.FileField(upload_to='profile_pics',
                                     default='settings.MEDIA_ROOT/profile_pics/boo.jpg')
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['username']

    @property
    def type(self):
        return self.__class__.__name__
