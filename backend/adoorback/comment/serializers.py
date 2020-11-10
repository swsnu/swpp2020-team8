from rest_framework import serializers
from django.contrib.auth import get_user_model

from comment.models import Comment
from adoorback.serializers import AdoorBaseSerializer
from adoorback.utils.content_types import get_content_type


User = get_user_model()


class RecursiveReplyField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class CommentSerializer(AdoorBaseSerializer):
    target_type = serializers.SerializerMethodField(read_only=True)
    target_id = serializers.SerializerMethodField(read_only=True)
    is_reply = serializers.SerializerMethodField(read_only=True)
    replies = RecursiveReplyField(many=True)

    def get_target_type(self, obj):
        return obj.target.type

    def get_target_id(self, obj):
        return obj.object_id

    def get_is_reply(self, obj):
        return obj.content_type == get_content_type("comment")

    class Meta(AdoorBaseSerializer.Meta):
        model = Comment
        fields = ['id', 'type', 'is_reply', 'target_id', 'target_type',
                  'content', 'author', 'author_detail', 'is_private',
                  'like_count', 'current_user_liked',
                  'replies', 'created_at', 'updated_at']

        def get_related_field(self, obj):
            return CommentSerializer()
