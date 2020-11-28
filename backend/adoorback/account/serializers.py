import random

from rest_framework import serializers
from django.contrib.auth import get_user_model

from account.models import FriendRequest, Friendship
from adoorback.settings import BASE_URL

User = get_user_model()


class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for auth and profile update
    """
    url = serializers.HyperlinkedIdentityField(
        view_name='user-detail', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password',
                  'profile_pic', 'question_history', 'url']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'],
                                        email=validated_data['email'],
                                        password=validated_data['password'])
        return user


class AuthorFriendSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField(read_only=True)

    def get_url(self, obj):
        return f'{BASE_URL}/api/user/{obj.id}/'

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_pic', 'url']


class AuthorAnonymousSerializer(serializers.ModelSerializer):
    color_hex = serializers.SerializerMethodField(read_only=True)

    def get_color_hex(self, obj):
        author_hash = obj.id * \
            random.randint(4343, 54897) * random.randint(100, 938574)
        # mod max color HEX
        return '#{0:06X}'.format(author_hash % 16777215)

    class Meta:
        model = User
        fields = ['color_hex']


class UserFriendListSerializer(serializers.ModelSerializer):
    # friend_ids = serializers.SerializerMethodField(read_only=True)

    def get_friend_ids(self, obj):
        # return self.context.get('request', None).user.friends.values_list('id', flat=True)
        return list(obj.friends.values_list('id', flat=True))

    class Meta:
        model = User
        fields = ['friend_ids']


class UserFriendshipDetailSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField()
    friend_id = serializers.IntegerField()

    class Meta:
        model = Friendship
        fields = ['user_id', 'friend_id']


class UserFriendRequestSerializer(serializers.ModelSerializer):
    requester_id = serializers.IntegerField()
    requestee_id = serializers.IntegerField()
    accepted = serializers.BooleanField(allow_null=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'requester_id', 'requestee_id', 'accepted']


class UserFriendshipStatusSerializer(AuthorFriendSerializer):
    sent_friend_request_to = serializers.SerializerMethodField(read_only=True)
    received_friend_request_from = serializers.SerializerMethodField(read_only=True)
    are_friends = serializers.SerializerMethodField(read_only=True, allow_null=True)

    def get_received_friend_request_from(self, obj):
        return self.context.get('request', None).user.id in \
               list(obj.sent_friend_requests.values_list('requestee_id', flat=True))

    def get_sent_friend_request_to(self, obj):
        return self.context.get('request', None).user.id in \
               list(obj.received_friend_requests.values_list('requester_id', flat=True))

    def get_are_friends(self, obj):
        user_id=self.context.get('request', None).user.id
        if user_id == obj.id:
            return None
        elif Friendship.objects.filter(user_id=self.context.get('request', None).user.id,
                                       friend_id=obj.id).exists():
            return True
        else:
            return False

    class Meta(AuthorFriendSerializer.Meta):
        model = User
        fields = AuthorFriendSerializer.Meta.fields + ['sent_friend_request_to',
                                                       'received_friend_request_from',
                                                       'are_friends']
