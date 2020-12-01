from rest_framework import serializers
from django.contrib.auth import get_user_model

from notification.models import Notification
from account.serializers import AuthorFriendSerializer, AuthorAnonymousSerializer


User = get_user_model()


class NotificationSerializer(serializers.ModelSerializer):

    is_response_request = serializers.SerializerMethodField(read_only=True)
    is_friend_request = serializers.SerializerMethodField(read_only=True)
    actor_detail = serializers.SerializerMethodField(read_only=True)
    question_content = serializers.SerializerMethodField(read_only=True)

    def get_is_response_request(self, obj):
        return obj.target.type == 'ResponseRequest'

    def get_is_friend_request(self, obj):
        return obj.target.type == 'FriendRequest'

    def get_actor_detail(self, obj):
        if User.are_friends(self.context.get('request', None).user, obj.actor):
            return AuthorFriendSerializer(obj.actor).data
        if obj.target.type == 'FriendRequest':
            return AuthorFriendSerializer(obj.actor).data
        return AuthorAnonymousSerializer(obj.actor).data

    def get_question_content(self, obj):
        if obj.target.type == 'ResponseRequest' or obj.target.type == 'Response':
            content = obj.target.question.content
            return content if len(content) <= 30 else content[:30] + '...'

    class Meta:
        model = Notification
        fields = ['id', 'is_response_request', 'is_friend_request', 'actor_detail',
                  'message', 'question_content', 'is_read', 'created_at', 'redirect_url']
