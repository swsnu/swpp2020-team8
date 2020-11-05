from rest_framework import serializers
from django.contrib.auth import get_user_model
from feed.models import Article, Response, Question, Post
User = get_user_model()


class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    author = serializers.HyperlinkedRelatedField(view_name='user-detail', read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'author', 'content', 'created_at', 'updated_at']
