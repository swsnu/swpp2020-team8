from django.contrib.auth import get_user_model
from rest_framework import serializers

from feed.models import Article, Response, Question, Post
from adoorback.serializers import AdoorBaseSerializer
from comment.serializers import CommentSerializer

User = get_user_model()


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

    def to_representation(self, obj):
        if isinstance(obj.target, Article):
            self.Meta.model = Article
            return ArticleSerializer(obj.target, context=self.context).to_representation(obj.target)
        elif isinstance(obj.target, Question):
            self.Meta.model = Question
            return QuestionSerializer(obj.target, context=self.context).to_representation(obj.target)
        elif isinstance(obj.target, Response):
            self.Meta.model = Response
            return ResponseSerializer(obj.target, context=self.context).to_representation(obj.target)
        return super().to_representation(obj.target)


class ArticleSerializer(AdoorBaseSerializer):
    comments = CommentSerializer(source='article_comments', many=True, read_only=True)

    class Meta(AdoorBaseSerializer.Meta):
        model = Article
        fields = AdoorBaseSerializer.Meta.fields + ['comments']


class ResponseSerializer(AdoorBaseSerializer):
    comments = CommentSerializer(source='response_comments', many=True, read_only=True)

    class Meta(AdoorBaseSerializer.Meta):
        model = Response
        fields = AdoorBaseSerializer.Meta.fields + ['comments']


class QuestionSerializer(AdoorBaseSerializer):

    class Meta(AdoorBaseSerializer.Meta):
        model = Question


class QuestionDetailSerializer(QuestionSerializer):
    responses = ResponseSerializer(many=True, read_only=True)

    class Meta(QuestionSerializer):
        model = Question
        fields = AdoorBaseSerializer.Meta.fields + ['responses']
