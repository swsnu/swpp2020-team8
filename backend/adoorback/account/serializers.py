from rest_framework import serializers
from django.contrib.auth import get_user_model

from feed.serializers import ArticleSerializer
from friendship.serializers import FriendshipSerializer
from friendrequest.serializers import FriendRequestSerializer

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'question_history', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'],
                                        email=validated_data['email'],
                                        password=validated_data['password'])
        return user


class UserDetailedSerializer(serializers.HyperlinkedModelSerializer):
    article_set = ArticleSerializer(many=True, read_only=True)
    friend_set = FriendshipSerializer(many=True)
    sent_friend_request_set = FriendRequestSerializer(many=True)
    received_friend_request_set = FriendRequestSerializer(many=True)
    url = serializers.HyperlinkedIdentityField(
        view_name="accounts:user-detail")

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'question_history',
                  'profile_image', 'article_set', 'url']


class UserFriendListSerializer(serializers.ModelSerializer):
    friend_set = FriendshipSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'friend_set']


class UserFriendRequestSerializer(serializers.ModelSerializer):
    friend_set = FriendshipSerializer(many=True)
    sent_friend_request_set = FriendRequestSerializer(many=True)
    received_friend_request_set = FriendRequestSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'sent_friend_request_set',
                  'received_friend_request_set']
