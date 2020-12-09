from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import NotAcceptable
from rest_framework.validators import UniqueTogetherValidator

from feed.models import Article, Response, Question, Post, ResponseRequest
from adoorback.serializers import AdoorBaseSerializer
from adoorback.settings.base import BASE_URL
from comment.serializers import CommentFriendSerializer, CommentResponsiveSerializer, CommentAnonymousSerializer
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
            return QuestionFriendSerializer(obj.target, context=self.context).to_representation(obj.target)
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


class ArticleFriendSerializer(AdoorBaseSerializer):
    author = serializers.HyperlinkedIdentityField(
        view_name='user-detail', read_only=True)
    author_detail = AuthorFriendSerializer(source='author', read_only=True)
    comments = serializers.SerializerMethodField()

    def get_comments(self, obj):
        current_user = self.context.get('request', None).user
        if obj.author == current_user:
            comments = obj.article_comments.order_by('is_anonymous', '-id')
            return CommentResponsiveSerializer(comments, many=True, read_only=True, context=self.context).data
        else:
            comments = obj.article_comments.filter(is_anonymous=False, is_private=False).order_by('-id')
            return CommentFriendSerializer(comments, many=True, read_only=True, context=self.context).data

    class Meta(AdoorBaseSerializer.Meta):
        model = Article
        fields = AdoorBaseSerializer.Meta.fields + ['share_with_friends', 'share_anonymously',
                                                    'author', 'author_detail', 'comments']


class ArticleAnonymousSerializer(AdoorBaseSerializer):
    comments = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField(read_only=True)
    author_detail = serializers.SerializerMethodField(
        source='author', read_only=True)

    def get_author_detail(self, obj):
        if obj.author == self.context.get('request', None).user:
            return AuthorFriendSerializer(obj.author).data
        return AuthorAnonymousSerializer(obj.author).data

    def get_author(self, obj):
        if obj.author == self.context.get('request', None).user:
            return f'{BASE_URL}/api/user/{obj.author.id}/'
        return None

    def get_comments(self, obj):
        current_user = self.context.get('request', None).user
        if obj.author == current_user:
            comments = obj.article_comments.order_by('-is_anonymous', '-id')
            return CommentResponsiveSerializer(comments, many=True, read_only=True, context=self.context).data
        else:
            comments = obj.article_comments.filter(is_anonymous=True, is_private=False).order_by('-id')
            return CommentAnonymousSerializer(comments, many=True, read_only=True, context=self.context).data

    class Meta(AdoorBaseSerializer.Meta):
        model = Article
        fields = AdoorBaseSerializer.Meta.fields + ['share_with_friends', 'share_anonymously',
                                                    'author', 'author_detail', 'comments']


class QuestionBaseSerializer(AdoorBaseSerializer):
    is_admin_question = serializers.SerializerMethodField(read_only=True)

    def get_is_admin_question(self, obj):
        return obj.author.is_superuser

    class Meta(AdoorBaseSerializer.Meta):
        model = Question
        fields = AdoorBaseSerializer.Meta.fields + \
                 ['selected_date', 'is_admin_question']


class ResponseBaseSerializer(AdoorBaseSerializer):
    question = QuestionBaseSerializer(read_only=True)
    question_id = serializers.IntegerField()

    class Meta(AdoorBaseSerializer.Meta):
        model = Response
        fields = AdoorBaseSerializer.Meta.fields + ['share_with_friends', 'share_anonymously',
                                                    'question', 'question_id']


class ResponseFriendSerializer(ResponseBaseSerializer):
    author = serializers.HyperlinkedIdentityField(
        view_name='user-detail', read_only=True)
    author_detail = AuthorFriendSerializer(source='author', read_only=True)
    comments = serializers.SerializerMethodField()

    def get_comments(self, obj):
        current_user = self.context.get('request', None).user
        if obj.author == current_user:
            comments = obj.response_comments.order_by('is_anonymous', '-id')
            return CommentResponsiveSerializer(comments, many=True, read_only=True, context=self.context).data
        else:
            comments = obj.response_comments.filter(is_anonymous=False, is_private=False).order_by('-id')
            return CommentFriendSerializer(comments, many=True, read_only=True, context=self.context).data

    class Meta(ResponseBaseSerializer.Meta):
        model = Response
        fields = ResponseBaseSerializer.Meta.fields + \
                 ['author', 'author_detail', 'comments']


class ResponseAnonymousSerializer(ResponseBaseSerializer):
    comments = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField(read_only=True)
    author_detail = serializers.SerializerMethodField(
        source='author', read_only=True)

    def get_author_detail(self, obj):
        if obj.author == self.context.get('request', None).user:
            return AuthorFriendSerializer(obj.author).data
        return AuthorAnonymousSerializer(obj.author).data

    def get_author(self, obj):
        if obj.author == self.context.get('request', None).user:
            return f'{BASE_URL}/api/user/{obj.author.id}/'
        return None

    def get_comments(self, obj):
        current_user = self.context.get('request', None).user
        if obj.author == current_user:
            comments = obj.response_comments.order_by('-is_anonymous', '-id')
            return CommentResponsiveSerializer(comments, many=True, read_only=True, context=self.context).data
        else:
            comments = obj.response_comments.filter(is_anonymous=True, is_private=False).order_by('-id')
            return CommentAnonymousSerializer(comments, many=True, read_only=True, context=self.context).data

    class Meta(ResponseBaseSerializer.Meta):
        model = Response
        fields = ResponseBaseSerializer.Meta.fields + ['author', 'author_detail', 'comments']


class ResponseResponsiveSerializer(ResponseBaseSerializer):
    author = serializers.SerializerMethodField(read_only=True)
    author_detail = serializers.SerializerMethodField(
        source='author', read_only=True)

    def get_author_detail(self, obj):
        current_user = self.context.get('request', None).user
        if User.are_friends(current_user, obj.author) or obj.author == current_user:
            return AuthorFriendSerializer(obj.author).data
        return AuthorAnonymousSerializer(obj.author).data

    def get_author(self, obj):
        current_user = self.context.get('request', None).user
        if User.are_friends(current_user, obj.author) or obj.author == current_user:
            return f'{BASE_URL}/api/user/{obj.author.id}/'
        return None

    class Meta(ResponseBaseSerializer.Meta):
        model = Article
        fields = ResponseBaseSerializer.Meta.fields + \
                 ['author', 'author_detail']


class QuestionResponsiveSerializer(QuestionBaseSerializer):
    """
    for questions in question feed (no responses, author profile responsive)
    """
    author = serializers.SerializerMethodField(read_only=True)
    author_detail = serializers.SerializerMethodField(
        source='author', read_only=True)

    def get_author_detail(self, obj):
        current_user = self.context.get('request', None).user
        if User.are_friends(current_user, obj.author) or obj.author == current_user:
            return AuthorFriendSerializer(obj.author).data
        return AuthorAnonymousSerializer(obj.author).data

    def get_author(self, obj):
        if User.are_friends(self.context.get('request', None).user, obj.author):
            return f'{BASE_URL}/api/user/{obj.author.id}/'
        return None

    class Meta(QuestionBaseSerializer.Meta):
        model = Question
        fields = QuestionBaseSerializer.Meta.fields + \
                 ['author', 'author_detail']


class QuestionFriendSerializer(QuestionBaseSerializer):
    """
    for questions in friend feed (no responses)

    function is redundant to `QuestionResponsiveSerializer`
    but allows for faster responses when rendering friend/anonymous feeds.
    """
    author = serializers.HyperlinkedIdentityField(
        view_name='user-detail', read_only=True)
    author_detail = AuthorFriendSerializer(source='author', read_only=True)

    class Meta(QuestionBaseSerializer.Meta):
        model = Question
        fields = QuestionBaseSerializer.Meta.fields + \
                 ['author', 'author_detail']


class QuestionAnonymousSerializer(QuestionBaseSerializer):
    """
    for questions in anonymous feed (no responses)

    function is redundant to `QuestionResponsiveSerializer`
    but allows for faster responses when rendering friend/anonymous feeds.
    """
    author = serializers.SerializerMethodField(read_only=True)
    author_detail = serializers.SerializerMethodField(
        source='author', read_only=True)

    def get_author_detail(self, obj):
        if obj.author == self.context.get('request', None).user:
            return AuthorFriendSerializer(obj.author).data
        return AuthorAnonymousSerializer(obj.author).data

    def get_author(self, obj):
        if obj.author == self.context.get('request', None).user:
            return f'{BASE_URL}/api/user/{obj.author.id}/'
        return None

    class Meta(QuestionBaseSerializer.Meta):
        model = Question
        fields = QuestionBaseSerializer.Meta.fields + ['author', 'author_detail']


class QuestionDetailAllResponsesSerializer(QuestionResponsiveSerializer):
    """
    for question detail page w/ all responses (friend + anonymous)
    """
    response_set = serializers.SerializerMethodField()

    def get_response_set(self, obj):
        current_user = self.context.get('request', None).user
        responses = obj.response_set.filter(author_id__in=current_user.friend_ids) | \
                    obj.response_set.filter(share_anonymously=True) | \
                    obj.response_set.filter(author_id=current_user.id)
        responses.order_by('-id')
        return ResponseResponsiveSerializer(responses, many=True, read_only=True, context=self.context).data

    class Meta(QuestionResponsiveSerializer.Meta):
        model = Question
        fields = QuestionResponsiveSerializer.Meta.fields + ['response_set']


class QuestionDetailFriendResponsesSerializer(QuestionResponsiveSerializer):
    """
    for question detail page w/ friend responses
    """
    response_set = serializers.SerializerMethodField()

    def get_response_set(self, obj):
        current_user = self.context.get('request', None).user
        responses = obj.response_set.filter(author_id__in=current_user.friend_ids) | \
                    obj.response_set.filter(author_id=current_user.id)
        responses.order_by('-id')
        return ResponseFriendSerializer(responses, many=True, read_only=True, context=self.context).data

    class Meta(QuestionResponsiveSerializer.Meta):
        model = Question
        fields = QuestionResponsiveSerializer.Meta.fields + ['response_set']


class QuestionDetailAnonymousResponsesSerializer(QuestionResponsiveSerializer):
    """
    for question detail page w/ anonymous responses
    """
    response_set = serializers.SerializerMethodField()

    def get_response_set(self, obj):
        responses = obj.response_set.filter(share_anonymously=True)
        responses.order_by('-id')
        return ResponseAnonymousSerializer(responses, many=True, read_only=True, context=self.context).data

    class Meta(QuestionResponsiveSerializer.Meta):
        model = Question
        fields = QuestionResponsiveSerializer.Meta.fields + ['response_set']


class ResponseRequestSerializer(serializers.ModelSerializer):
    requester_id = serializers.IntegerField()
    requestee_id = serializers.IntegerField()
    question_id = serializers.IntegerField()

    def validate(self, data):
        if data.get('requester_id') == data.get('requestee_id'):
            raise serializers.ValidationError('본인과는 친구가 될 수 없어요...')
        return data

    class Meta():
        model = ResponseRequest
        fields = ['id', 'requester_id', 'requestee_id', 'question_id']

        validators = [
            UniqueTogetherValidator(
                queryset=ResponseRequest.objects.all(),
                fields=['requester_id', 'requestee_id', 'question_id']
            )
        ]
