from rest_framework import generics
from rest_framework import permissions

from like.models import Like
from like.serializers import LikeSerializer

from adoorback.permissions import IsOwnerOrReadOnly
from adoorback.utils.content_types import get_content_type


class LikeList(generics.ListCreateAPIView):
    """
    List all likes, or create a new like.
    """
    queryset = Like.objects.order_by('-id')
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        content_type_id = get_content_type(self.request.data['target_type']).id
        serializer.save(user=self.request.user,
                        content_type_id=content_type_id,
                        object_id=self.request.data['target_id'])


class LikeDestroy(generics.DestroyAPIView):
    """
    Destroy a like.
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
