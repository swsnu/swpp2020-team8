from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

class AdoorTimestampedModel(models.Model):
    class Meta:
        abstract = True

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

class AdoorModel(AdoorTimestampedModel):
    class Meta:
        abstract = True

    content = models.TextField()

    def __str__(self):
        return self.content
