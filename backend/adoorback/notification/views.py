from rest_framework import generics
from rest_framework import permissions

from notification.models import Notification
from notification.serializers import NotificationSerializer

from adoorback.permissions import IsOwnerOrReadOnly
from adoorback.utils.content_types import get_content_type


class NotificationList(generics.ListCreateAPIView):
    """
    List all comments, or create a new notification.
    """
    queryset = Notification.objects.all().order_by('-id')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    # def perform_create(self, serializer):
    #     content_type_id = get_content_type(self.request.data['target_type']).id
    #     serializer.save(author=self.request.user,
    #                     content_type_id=content_type_id,
    #                     object_id=self.request.data['target_id'])


class NotificationDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or destroy a notification.
    """
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
