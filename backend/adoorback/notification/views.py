from rest_framework import generics
from rest_framework import permissions

from notification.models import Notification
from notification.serializers import NotificationSerializer

from adoorback.permissions import IsRecipient
from adoorback.utils.content_types import get_content_type


class NotificationList(generics.ListAPIView):
    """
    List all comments, or create a new notification.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Notification.objects.filter(recipient_id = self.request.user.id).order_by('-created_at')
        return queryset


class NotificationDetail(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsRecipient]
