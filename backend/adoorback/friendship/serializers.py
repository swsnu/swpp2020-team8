from django.contrib.auth import get_user_model
from rest_framework import serializers

from friendship.models import Friendship
from adoorback.serializers import AdoorBaseSerializer

User = get_user_model()


class FriendshipSerializer(AdoorBaseSerializer):
    # user = serializers.HyperlinkedIdentityField(
    #     view_name='user-detail', read_only=True)
    # user_detail = serializers.SerializerMethodField(read_only=True)
    # friend = serializers.HyperlinkedIdentityField(
    #     view_name='friend-detail', read_only=True)
    # friend_detail = serializers.SerializerMethodField(read_only=True)

    # def get_user_detail(self, obj):
    #     user = obj.user
    #     return {
    #         "id": user.id,
    #         "username": user.username,
    #     }

    # def get_friend_detail(self, obj):
    #     friend = obj.friend
    #     return {
    #         "id": friend.id,
    #         "username": friend.username,
    #     }

    class Meta(AdoorBaseSerializer.Meta):
        model = Friendship
        fields = AdoorBaseSerializer.Meta.fields + ['user']
