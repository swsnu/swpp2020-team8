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

    def admin_only(self, **kwargs):
        admin = User.objects.filter(is_superuser=True).first()
        return self.filter(actor=admin, **kwargs)


class Notification(AdoorTimestampedModel):
    user = models.ForeignKey(User, related_name='received_noti_set', on_delete=models.CASCADE)
    actor = models.ForeignKey(User, related_name='sent_noti_set', on_delete=models.CASCADE)

    # target: notification을 발생시킨 직접적인 원인(?)
    target_type = models.ForeignKey(ContentType,
                                    on_delete=models.CASCADE,
                                    related_name='targetted_noti_set')
    target_id = models.IntegerField(blank=True, null=True)
    target = GenericForeignKey('target_type', 'target_id')

    # origin: target의 target (target의 target이 없을 경우 target의 직접적인 발생지)
    origin_type = models.ForeignKey(ContentType,
                                    on_delete=models.CASCADE,
                                    related_name='origin_noti_set')
    origin_id = models.IntegerField(blank=True, null=True)
    origin = GenericForeignKey('origin_type', 'origin_id')

    # redirect: target의 근원지(?), origin != redirect_url의 모델일 경우가 있음 (e.g. reply)
    redirect_url = models.CharField(max_length=150)
    message = models.CharField(max_length=100)

    is_visible = models.BooleanField(default=True)
    is_read = models.BooleanField(default=False)

    objects = NotificationManager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.message
