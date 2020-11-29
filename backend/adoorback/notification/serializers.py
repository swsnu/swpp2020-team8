from rest_framework import serializers
from django.contrib.auth import get_user_model

from notification.models import Notification
from account.serializers import AuthorFriendSerializer, AuthorAnonymousSerializer

User = get_user_model()


class NotificationSerializer(serializers.ModelSerializer):
    actor = serializers.HyperlinkedIdentityField(
        view_name='user-detail', read_only=True)
    actor_detail = serializers.SerializerMethodField(read_only=True)
    target_type = serializers.SerializerMethodField()
    target_id = serializers.IntegerField()
    origin_type = serializers.SerializerMethodField()
    origin_id = serializers.IntegerField()

    def get_actor_detail(self, obj):
        if User.are_friends(self.context.get('request', None).user, obj.actor):
            return AuthorFriendSerializer(obj.actor).data
        return AuthorAnonymousSerializer(obj.actor).data

    def get_target_type(self, obj):
        return obj.target.type

    def get_origin_type(self, obj):
        return obj.origin.type

    class Meta:
        model = Notification
        fields = ['id', 'message', 'actor', 'actor_detail',
                  'target_type', 'target_id', 'origin_type', 'origin_id',
                  'is_visible', 'is_read', 'created_at', 'updated_at']
