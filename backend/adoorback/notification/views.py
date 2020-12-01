from rest_framework import generics
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from notification.models import Notification
from notification.serializers import NotificationSerializer

from adoorback.permissions import IsOwnerOrReadOnly


class NotificationList(generics.ListAPIView, generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return Notification.objects.visible_only().filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        self.get_queryset().filter(user=request.user).update(is_read=True)
        queryset = Notification.objects.visible_only().filter(user=request.user)
        serializer = NotificationSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class NotificationDetail(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    authentication_classes = [SessionAuthentication, TokenAuthentication]
