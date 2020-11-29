from rest_framework import serializers
from django.contrib.auth import get_user_model

from like.models import Like
from adoorback.serializers import AdoorBaseSerializer

User = get_user_model()


class LikeSerializer(serializers.ModelSerializer):
    user = serializers.HyperlinkedIdentityField(
        view_name='user-detail', read_only=True)
    user_detail = serializers.SerializerMethodField(read_only=True)

    def get_user_detail(self, obj):
        user = obj.user
        return {
            "id": user.id,
            "username": user.username,
        }

    class Meta(AdoorBaseSerializer.Meta):
        model = Like
        fields = ['id', 'type', 'user', 'user_detail']
