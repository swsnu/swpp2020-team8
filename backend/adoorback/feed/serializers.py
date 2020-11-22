from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import NotAcceptable

from feed.models import Article, Response, Question, Post
from adoorback.serializers import AdoorBaseSerializer
from comment.serializers import CommentFriendSerializer, CommentAnonymousSerializer
from account.serializers import AuthorFriendSerializer, AuthorAnonymousSerializer

User = get_user_model()


class PostFriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

    def to_representation(self, obj):
        if isinstance(obj.target, Article):
            self.Meta.model = Article
            return ArticleFriendSerializer(obj.target, context=self.context).to_representation(obj.target)
        elif isinstance(obj.target, Question):
            self.Meta.model = Question
            return QuestionPublicSerializer(obj.target, context=self.context).to_representation(obj.target)
        elif isinstance(obj.target, Response):
            self.Meta.model = Response
            return ResponseFriendSerializer(obj.target, context=self.context).to_representation(obj.target)
        raise NotAcceptable(detail=None, code=404)


class PostAnonymousSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

    def to_representation(self, obj):
        if isinstance(obj.target, Article):
            self.Meta.model = Article
            return ArticleAnonymousSerializer(obj.target, context=self.context).to_representation(obj.target)
        elif isinstance(obj.target, Question):
            self.Meta.model = Question
            return QuestionAnonymousSerializer(obj.target, context=self.context).to_representation(obj.target)
        elif isinstance(obj.target, Response):
            self.Meta.model = Response
            return ResponseAnonymousSerializer(obj.target, context=self.context).to_representation(obj.target)
        raise NotAcceptable(detail=None, code=404)


class ArticleBaseSerializer(AdoorBaseSerializer):

    class Meta(AdoorBaseSerializer.Meta):
        model = Article
        fields = AdoorBaseSerializer.Meta.fields + ['share_with_friends', 'share_anonymously']


class ArticleFriendSerializer(ArticleBaseSerializer):
    author = AuthorFriendSerializer(read_only=True)
    comments = CommentFriendSerializer(source='article_comments', many=True, read_only=True)

    class Meta(ArticleBaseSerializer.Meta):
        model = Article
        fields = ArticleBaseSerializer.Meta.fields + ['author', 'comments']


class ArticleAnonymousSerializer(ArticleBaseSerializer):
    author = AuthorAnonymousSerializer()
    comments = CommentAnonymousSerializer(source='article_comments', many=True, read_only=True)

    class Meta(ArticleBaseSerializer.Meta):
        model = Article
        fields = ArticleBaseSerializer.Meta.fields + ['author', 'comments']


class QuestionBaseSerializer(AdoorBaseSerializer):
    is_admin_question = serializers.SerializerMethodField(read_only=True)

    def get_is_admin_question(self, obj):
        return obj.author.is_superuser

    class Meta(AdoorBaseSerializer.Meta):
        model = Question
        fields = AdoorBaseSerializer.Meta.fields + ['selected_date', 'is_admin_question']


class QuestionPublicSerializer(QuestionBaseSerializer):
    author = AuthorFriendSerializer(read_only=True)

    class Meta(QuestionBaseSerializer.Meta):
        model = Question
        fields = QuestionBaseSerializer.Meta.fields + ['author']


class QuestionAnonymousSerializer(QuestionBaseSerializer):
    author = AuthorAnonymousSerializer(read_only=True)

    class Meta(QuestionBaseSerializer.Meta):
        model = Question
        fields = QuestionBaseSerializer.Meta.fields + ['author']


class ResponseBaseSerializer(AdoorBaseSerializer):

    class Meta(AdoorBaseSerializer.Meta):
        model = Response
        fields = AdoorBaseSerializer.Meta.fields + ['share_with_friends', 'share_anonymously']


class ResponseFriendSerializer(ResponseBaseSerializer):
    author = AuthorFriendSerializer(read_only=True)
    question_id = serializers.IntegerField()
    question = QuestionBaseSerializer(read_only=True)
    comments = CommentFriendSerializer(source='response_comments', many=True, read_only=True)

    def get_question_id(self, obj):
        return obj.question_id

    class Meta(ResponseBaseSerializer.Meta):
        model = Response
        fields = ResponseBaseSerializer.Meta.fields + ['author', 'question_id', 'question', 'comments']


class ResponseAnonymousSerializer(ResponseBaseSerializer):
    author = AuthorAnonymousSerializer(read_only=True)
    question_id = serializers.IntegerField()
    question = QuestionBaseSerializer(read_only=True)
    comments = CommentAnonymousSerializer(source='response_comments', many=True, read_only=True)

    def get_question_id(self, obj):
        return obj.question_id

    class Meta(ResponseBaseSerializer.Meta):
        model = Article
        fields = ResponseBaseSerializer.Meta.fields + ['author', 'question_id', 'question', 'comments']


class QuestionDetailPublicSerializer(QuestionPublicSerializer):
    response_set = ResponseFriendSerializer(source='friend_response_set', many=True, read_only=True)

    class Meta(QuestionPublicSerializer.Meta):
        model = Question
        fields = QuestionPublicSerializer.Meta.fields + ['response_set']


class QuestionDetailAnonymousSerializer(QuestionAnonymousSerializer):
    response_set = ResponseAnonymousSerializer(source='anonymous_response_set', many=True, read_only=True)

    class Meta(QuestionAnonymousSerializer.Meta):
        model = Question
        fields = QuestionAnonymousSerializer.Meta.fields + ['response_set']
