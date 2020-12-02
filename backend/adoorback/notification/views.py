from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from notification.models import Notification
from notification.serializers import NotificationSerializer

from adoorback.permissions import IsOwnerOrReadOnly


class NotificationList(generics.ListAPIView, generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

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

    def get_object(self):
        return Notification.objects.get(id=self.kwargs.get('pk'))

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)  # check `is_read` field
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        if self.get_object().user != self.request.user:
            raise PermissionDenied("requester가 본인이 아닙니다...")
        return serializer.save()
