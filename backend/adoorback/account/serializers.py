from rest_framework import serializers
from django.contrib.auth import get_user_model
from feed.models import Article

User = get_user_model()


class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    article_set = serializers.HyperlinkedRelatedField(many=True, view_name='article-detail', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'question_history', 'profile_image',
                  'article_set', 'created_at', 'updated_at']

# TODO: https://www.django-rest-framework.org/api-guide/relations/#writable-nested-serializers
# TODO: https://www.django-rest-framework.org/api-guide/validators/