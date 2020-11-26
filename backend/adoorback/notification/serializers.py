from rest_framework import serializers
from django.contrib.auth import get_user_model

from notification.models import Notification
from account.serializers import AuthorFriendSerializer, AuthorAnonymousSerializer


User = get_user_model()


class NotificationSerializer(serializers.ModelSerializer):

    actor = serializers.HyperlinkedIdentityField(
        view_name='user-detail', read_only=True)
    actor_detail = serializers.SerializerMethodField(read_only=True)
    recipient = serializers.HyperlinkedIdentityField(
        view_name='user-detail', read_only=True)
    recipient_detail = serializers.SerializerMethodField(read_only=True)
    target_type = serializers.SerializerMethodField()
    target_id = serializers.SerializerMethodField()
    origin_type = serializers.SerializerMethodField()
    origin_id = serializers.SerializerMethodField()
    feed_type = serializers.SerializerMethodField()
    feed_id = serializers.SerializerMethodField()

    def get_actor_detail(self, obj):
        if User.are_friends(self.context.get('request', None).user, obj.actor):
            return AuthorFriendSerializer(obj.actor).data
        return AuthorAnonymousSerializer(obj.actor).data

    def get_recipient_detail(self, obj):
        return AuthorFriendSerializer(obj.recipient).data

    def get_target_type(self, obj):
        return obj.target.type

    def get_target_id(self, obj):
        return obj.target_id

    def get_origin_type(self, obj):
        return obj.origin.type

    def get_origin_id(self, obj):
        return obj.origin_id

    def get_feed_type(self, obj):
        if obj.origin.type == 'Comment':
            if obj.origin.target.type == 'Comment':
                return obj.target.target.type
            return obj.origin.target.type
        else:
            return obj.origin.type

    def get_feed_id(self, obj):
        if obj.origin.type == 'Comment':
            if obj.origin.target.type == 'Comment':
                return obj.target.target.id
            return obj.origin.target.id
        else:
            return obj.origin.id

    class Meta:
        model = Notification
        fields = ['id', 'message', 'actor', 'actor_detail', 'recipient', 'recipient_detail',
            'target_type', 'target_id', 'origin_type', 'origin_id', 'feed_type', 'feed_id',
            'is_visible', 'is_read', 'created_at', 'updated_at']
