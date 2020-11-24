from rest_framework import serializers
from django.contrib.auth import get_user_model

from feed.models import Article, Response, Question
from comment.models import Comment

User = get_user_model()


class AdoorBaseSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField(read_only=True)
    current_user_liked = serializers.SerializerMethodField(read_only=True)

    def get_like_count(self, obj):
        current_user = self.context['request'].user
        if obj.author != current_user:
            return None
        if isinstance(obj, Article):
            return obj.article_likes.count()
        elif isinstance(obj, Question):
            return obj.question_likes.count()
        elif isinstance(obj, Response):
            return obj.response_likes.count()
        elif isinstance(obj, Comment):
            return obj.comment_likes.count()

    def get_current_user_liked(self, obj):
        current_user = self.context['request'].user
        if isinstance(obj, Article):
            return obj.article_likes.filter(user=current_user).count() > 0
        elif isinstance(obj, Question):
            return obj.question_likes.filter(user=current_user).count() > 0
        elif isinstance(obj, Response):
            return obj.response_likes.filter(user=current_user).count() > 0
        elif isinstance(obj, Comment):
            return obj.comment_likes.filter(user=current_user).count() > 0

    class Meta:
        model = None
        fields = ['id', 'type', 'content', 'like_count', 'current_user_liked', 'created_at']
