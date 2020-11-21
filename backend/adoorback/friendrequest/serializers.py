from django.contrib.auth import get_user_model
from rest_framework import serializers

from friendrequest.models import FriendRequest
from adoorback.serializers import AdoorBaseSerializer

User = get_user_model()


class FriendRequestSerializer(serializers.ModelSerializer):

    class Meta(AdoorBaseSerializer.Meta):
        model = FriendRequest
        fields = ['actor', 'recipient']
