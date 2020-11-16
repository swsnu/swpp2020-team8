from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class AdoorModel(models.Model):
    class Meta:
        abstract = True

    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content
