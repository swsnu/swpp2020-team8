"""Django Model
Define Models for account APIs
"""


from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify


class User(AbstractUser):
    """User Model
    This model extends the Django Abstract User model
    """
    slug = models.SlugField(max_length=255, unique=True)
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

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.username)
        super().save(*args, **kwargs)

    @property
    def type(self):
        return self.__class__.__name__
