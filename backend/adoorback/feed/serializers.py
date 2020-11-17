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

    class Meta(AdoorBaseSerializer.Meta):
        model = Article
        fields = AdoorBaseSerializer.Meta.fields + ['share_with_friends', 'share_anonymously']


class ArticleDetailSerializer(AdoorBaseSerializer):
    comments = CommentSerializer(source='article_comments', many=True, read_only=True)

    class Meta(AdoorBaseSerializer.Meta):
        model = Article
        fields = AdoorBaseSerializer.Meta.fields + ['share_with_friends', 'share_anonymously', 'comments']


class QuestionSerializer(AdoorBaseSerializer):
    is_admin_question = serializers.SerializerMethodField(read_only=True)

    def get_is_admin_question(self, obj):
        return obj.author.is_superuser

    class Meta(AdoorBaseSerializer.Meta):
        model = Question
        fields = AdoorBaseSerializer.Meta.fields + ['selected_date', 'is_admin_question']


class ResponseDetailSerializer(AdoorBaseSerializer):
    question = QuestionSerializer(read_only=True)
    comments = CommentSerializer(source='response_comments', many=True, read_only=True)

    class Meta(AdoorBaseSerializer.Meta):
        model = Response
        fields = AdoorBaseSerializer.Meta.fields + ['question_id', 'share_with_friends',
                                                    'share_anonymously', 'question', 'comments']


class ResponseSerializer(AdoorBaseSerializer):
    question_id = serializers.IntegerField()
    question = QuestionSerializer(read_only=True)

    def get_question_id(self, obj):
        return obj.question_id

    class Meta(AdoorBaseSerializer.Meta):
        model = Response
        fields = AdoorBaseSerializer.Meta.fields + ['question_id', 'share_with_friends',
                                                    'share_anonymously', 'question']


class QuestionDetailSerializer(AdoorBaseSerializer):
    is_admin_question = serializers.SerializerMethodField(read_only=True)
    response_set = ResponseSerializer(many=True, read_only=True)

    def get_is_admin_question(self, obj):
        return obj.author.is_superuser

    class Meta(AdoorBaseSerializer.Meta):
        model = Question
        fields = AdoorBaseSerializer.Meta.fields + ['selected_date', 'is_admin_question', 'response_set']
