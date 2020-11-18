from django.utils import timezone
from rest_framework import generics
from rest_framework import permissions
from celery.schedules import crontab
from celery.task import periodic_task

from friendship.serializers import FriendshipSerializer
from friendship.models import Friendship
from adoorback.permissions import IsOwnerOrReadOnly


class UserFriendList(generics.ListCreateAPIView):
    """
    List all friends, or add a friendship.
    """
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
