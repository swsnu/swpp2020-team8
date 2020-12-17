from django.db import transaction
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from comment.models import Comment
from comment.serializers import CommentResponsiveSerializer

from adoorback.permissions import IsAuthorOrReadOnly
from adoorback.content_types import get_generic_relation_type
from adoorback.validators import adoor_exception_handler


class CommentCreate(generics.ListCreateAPIView):
    """
    List all comments
    """
    queryset = Comment.objects.order_by('id')
    serializer_class = CommentResponsiveSerializer
    permission_classes = [IsAuthenticated]

    def get_exception_handler(self):
        return adoor_exception_handler

    @transaction.atomic
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
    serializer_class = CommentResponsiveSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]

    def get_exception_handler(self):
        return adoor_exception_handler
