from django.contrib.contenttypes.fields import GenericForeignKey
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from adoorback.models import AdoorTimestampedModel


User = get_user_model()


class NotificationManager(models.Manager):

    def visible_only(self, **kwargs):
        return self.filter(is_visible=True, **kwargs)

    def unread_only(self, **kwargs):
        return self.filter(is_read=False, **kwargs)


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
    # TODO: remove blank=True, null=True after fixing feed/comment/like models
    redirect_url = models.CharField(max_length=150, blank=True, null=True)

    is_visible = models.BooleanField(default=True)
    is_read = models.BooleanField(default=False)

    objects = NotificationManager()

    def __str__(self):
        return self.message

    @property
    def type(self):
        return self.__class__.__name__
