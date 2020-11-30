from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from adoorback.models import AdoorTimestampedModel


User = get_user_model()


class Notification(AdoorTimestampedModel):
    user = models.ForeignKey(User, related_name='received_noti_set', on_delete=models.CASCADE)
    actor = models.ForeignKey(User, related_name='sent_noti_set', on_delete=models.CASCADE)

    target_type = models.ForeignKey(ContentType,
                                    on_delete=models.CASCADE,
                                    related_name='targetted_noti_set')
    target_id = models.IntegerField(blank=True, null=True)
    target = GenericForeignKey('target_type', 'target_id')

    origin_type = models.ForeignKey(ContentType,
                                    on_delete=models.CASCADE,
                                    related_name='origin_noti_set')
    origin_id = models.IntegerField(blank=True, null=True)
    origin = GenericForeignKey('origin_type', 'origin_id')

    message = models.CharField(max_length=100)
    redirect_url = models.CharField(max_length=150)

    is_visible = models.BooleanField(default=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.message

    @property
    def type(self):
        return self.__class__.__name__
