from rest_framework import serializers
from django.contrib.auth import get_user_model

from comment.models import Comment

from adoorback.serializers import AdoorBaseSerializer
from account.serializers import AuthorFriendSerializer, AuthorAnonymousSerializer

User = get_user_model()


class RecursiveReplyField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class CommentBaseSerializer(AdoorBaseSerializer):
    is_reply = serializers.SerializerMethodField(read_only=True)
    target_id = serializers.SerializerMethodField()

    def get_is_reply(self, obj):
        return obj.target.type == 'Comment'

    def get_target_id(self, obj):
        return obj.object_id

    class Meta(AdoorBaseSerializer.Meta):
        model = Comment
        fields = AdoorBaseSerializer.Meta.fields + ['is_reply', 'is_private', 'target_id']


class CommentFriendSerializer(CommentBaseSerializer):
    author_detail = AuthorFriendSerializer(source='author', read_only=True)
    replies = RecursiveReplyField(many=True, read_only=True)

    class Meta(CommentBaseSerializer.Meta):
        model = Comment
        fields = CommentBaseSerializer.Meta.fields + ['author_detail', 'replies']

    def get_related_field(self, obj):
        return CommentFriendSerializer()


class CommentAnonymousSerializer(CommentBaseSerializer):
    author_detail = AuthorAnonymousSerializer(source='author', read_only=True)
    replies = RecursiveReplyField(many=True, read_only=True)

    class Meta(CommentBaseSerializer.Meta):
        model = Comment
        fields = CommentBaseSerializer.Meta.fields + ['author_detail', 'replies']

    def get_related_field(self, obj):
        return CommentAnonymousSerializer()
