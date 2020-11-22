from rest_framework import serializers
from django.contrib.auth import get_user_model

<<<<<<< HEAD
from feed.serializers import ArticleSerializer
from friendship.serializers import FriendshipSerializer
from friendrequest.serializers import FriendRequestSerializer
=======
from adoorback.settings import BASE_URL
>>>>>>> 344e6bc35d25f486ed730a0a91a1d509245decbd

User = get_user_model()


class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for auth and profile update
    """
    url = serializers.HyperlinkedIdentityField(view_name='user-detail', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'question_history', 'url']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'],
                                        email=validated_data['email'],
                                        password=validated_data['password'])
        return user


<<<<<<< HEAD
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
    sent_friend_request_set = FriendRequestSerializer(many=True)
    received_friend_request_set = FriendRequestSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'sent_friend_request_set',
                  'received_friend_request_set']
=======
class AuthorFriendSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField(read_only=True)

    def get_profile(self, obj):
        return {"id": obj.id, "username": obj.username, "url": f'{BASE_URL}/api/user/{obj.id}/'}

    class Meta:
        model = User
        fields = ['profile']


class AuthorAnonymousSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField(read_only=True)

    def get_profile(self, obj):
        author_hash = obj.id * 349875348725974 + 23943223849124
        return {"color_hex": '#{0:06X}'.format(author_hash % 16777215)}  # mod max color HEX

    class Meta:
        model = User
        fields = ['profile']
>>>>>>> 344e6bc35d25f486ed730a0a91a1d509245decbd
