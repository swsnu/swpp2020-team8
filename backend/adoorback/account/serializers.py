import random

from rest_framework import serializers
from django.contrib.auth import get_user_model

from account.models import Friendship
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


<< << << < HEAD
   def get_profile(self, obj):
        author_hash = obj.id * 349875348725974 + 23943223849124
        # mod max color HEX
        return {"color_hex": '#{0:06X}'.format(author_hash % 16777215)}

    class Meta:
        model = User
        fields = ['profile']


class UserFriendshipDetailSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField()
    friend_id = serializers.IntegerField()

    class Meta:
        model = Friendship
        fields = ['user_id', 'friend_id']
== =====
   def get_color_hex(self, obj):
        author_hash = obj.id * \
            random.randint(4343, 54897) * random.randint(100, 938574)
        return '#{0:06X}'.format(author_hash % 16777215)  # mod max color HEX

    class Meta:
        model = User
        fields = ['color_hex']
>>>>>> > dc298ae27c36a1c0e97fec8f7d5163b260b1834c
