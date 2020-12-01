from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from comment.models import Comment
from comment.serializers import CommentFriendSerializer

from adoorback.permissions import IsAuthorOrReadOnly
from adoorback.utils.content_types import get_generic_relation_type


class CommentList(generics.ListCreateAPIView):
    """
    List all comments, or create a new comment.
    """
    queryset = Comment.objects.order_by('-id')
    serializer_class = CommentFriendSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        content_type_id = get_generic_relation_type(self.request.data['target_type']).id

        serializer.save(author=self.request.user,
                        content_type_id=content_type_id,
                        object_id=self.request.data['target_id'])


class CommentDetail(generics.DestroyAPIView):
    """
    Retrieve, update, or destroy a comment.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentFriendSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
