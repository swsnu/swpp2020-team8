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
    target_type = serializers.SerializerMethodField()
    target_id = serializers.SerializerMethodField()
    is_reply = serializers.SerializerMethodField(read_only=True)
    replies = RecursiveReplyField(many=True, read_only=True)

    def get_target_type(self, obj):
        return obj.target.type

    def get_target_id(self, obj):
        return obj.object_id

    def get_is_reply(self, obj):
        return obj.target.type == 'Comment'

    class Meta(AdoorBaseSerializer.Meta):
        model = Comment
        fields = AdoorBaseSerializer.Meta.fields + ['is_reply', 'target_id', 'target_type',
                                                    'is_private', 'replies']

        def get_related_field(self, obj):
            return CommentFriendSerializer()


class CommentFriendSerializer(CommentBaseSerializer):
    author = AuthorFriendSerializer()

    class Meta(CommentBaseSerializer.Meta):
        model = Comment
        fields = CommentBaseSerializer.Meta.fields + ['author']


class CommentAnonymousSerializer(CommentBaseSerializer):
    author = AuthorAnonymousSerializer()

    class Meta(CommentBaseSerializer.Meta):
        model = Comment
        fields = CommentBaseSerializer.Meta.fields + ['author']
