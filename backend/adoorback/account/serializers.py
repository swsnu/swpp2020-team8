from rest_framework import serializers
from django.contrib.auth import get_user_model

from feed.serializers import ArticleSerializer

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'question_history']


class UserDetailedSerializer(serializers.ModelSerializer):
    article_set = ArticleSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'question_history', 'profile_image', 'article_set']
