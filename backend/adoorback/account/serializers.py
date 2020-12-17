import secrets

from django.db import transaction
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from django.contrib.auth import get_user_model

from account.models import FriendRequest
from adoorback.settings.base import BASE_URL

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

    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
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
        author_hash = obj.id * secrets.randbelow(63872) * secrets.randbelow(98574)
        return '#{0:06X}'.format(author_hash % 16777215)  # mod max color HEX

    class Meta:
        model = User
        fields = ['color_hex']


class UserFriendRequestCreateSerializer(serializers.ModelSerializer):
    requester_id = serializers.IntegerField()
    requestee_id = serializers.IntegerField()
    accepted = serializers.BooleanField(allow_null=True, required=False)

    def validate(self, data):
        if data.get('requester_id') == data.get('requestee_id'):
            raise serializers.ValidationError('본인과는 친구가 될 수 없어요...')
        return data

    class Meta:
        model = FriendRequest
        fields = ['requester_id', 'requestee_id', 'accepted']
        validators = [
            UniqueTogetherValidator(
                queryset=FriendRequest.objects.all(),
                fields=['requester_id', 'requestee_id']
            )
        ]


class UserFriendRequestUpdateSerializer(serializers.ModelSerializer):
    requester_id = serializers.IntegerField(required=False)
    requestee_id = serializers.IntegerField(required=False)
    accepted = serializers.BooleanField(required=True)

    def validate(self, data):
        unknown = set(self.initial_data) - set(self.fields)
        if unknown:
            raise serializers.ValidationError("이 필드는 뭘까요...: {}".format(", ".join(unknown)))
        if self.instance.accepted is not None:
            raise serializers.ValidationError("이미 friend request에 응답하셨습니다...")
        return data

    class Meta:
        model = FriendRequest
        fields = UserFriendRequestCreateSerializer.Meta.fields


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
        user = self.context.get('request', None).user
        if user == obj:
            return None
        return User.are_friends(user, obj)

    class Meta(AuthorFriendSerializer.Meta):
        model = User
        fields = AuthorFriendSerializer.Meta.fields + ['sent_friend_request_to',
                                                       'received_friend_request_from',
                                                       'are_friends']
