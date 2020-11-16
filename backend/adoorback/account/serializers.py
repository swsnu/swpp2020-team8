from rest_framework import serializers
from django.contrib.auth import get_user_model

from feed.serializers import ArticleSerializer

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
    url = serializers.HyperlinkedIdentityField(
        view_name="accounts:user-detail")

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'question_history',
                  'profile_image', 'article_set', 'url']
