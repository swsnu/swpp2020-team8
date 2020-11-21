from django.contrib.auth import get_user_model
from rest_framework import serializers

from friendship.models import Friendship
from adoorback.serializers import AdoorBaseSerializer

User = get_user_model()


class FriendshipSerializer(serializers.ModelSerializer):

    class Meta(AdoorBaseSerializer.Meta):
        model = Friendship
        fields = ['user', 'friend']
