from django.utils import timezone
from rest_framework import generics
from rest_framework import permissions
from celery.schedules import crontab
from celery.task import periodic_task

import feed.serializers as fs
from feed.models import Article, Response, Question, Post
from adoorback.permissions import IsOwnerOrReadOnly, IsShared


@periodic_task(run_every=crontab(minute=0, hour=0))
def select_daily_questions():
    questions = Question.objects.all().filter(
        selected_date__isnull=True).order_by('?')[:30]
    for question in questions:
        question.selected_date = timezone.now()
        question.save()


class DailyQuestionList(generics.ListAPIView):
    serializer_class = fs.QuestionResponsiveSerializer
    model = serializer_class.Meta.model
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if Question.objects.daily_questions().count() == 0:
            select_daily_questions()
        return Question.objects.daily_questions().order_by('-id')


class ArticleList(generics.CreateAPIView):
    """
    List all articles, or create a new article.
    """
    queryset = Article.objects.all()
    serializer_class = fs.ArticleFriendSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ArticleDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or destroy an article.
    """
    queryset = Article.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly, IsShared]

    def get_serializer_class(self):
        article = Article.objects.get(id=self.kwargs.get('pk'))
        if article.author == self.request.user:  # TODO: modify after implementing friendship
            return fs.ArticleFriendSerializer
        return fs.ArticleAnonymousSerializer


class QuestionList(generics.ListCreateAPIView):
    """
    List all questions, or create a new question.
    """
    queryset = Question.objects.all()
    serializer_class = fs.QuestionResponsiveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class QuestionAllResponsesDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or destroy a question.
    """
    queryset = Question.objects.all()
    serializer_class = fs.QuestionDetailAllResponsesSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly, IsShared]


class QuestionFriendResponsesDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or destroy a question.
    """
    queryset = Question.objects.all()
    serializer_class = fs.QuestionDetailFriendResponsesSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly, IsShared]


class QuestionAnonymousResponsesDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or destroy a question.
    """
    queryset = Question.objects.all()
    serializer_class = fs.QuestionDetailAnonymousResponsesSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly, IsShared]


class ResponseList(generics.CreateAPIView):
    """
    List all responses, or create a new response.
    """
    queryset = Response.objects.all()
    serializer_class = fs.ResponseFriendSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ResponseDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or destroy a response.
    """
    queryset = Response.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly, IsShared]

    def get_serializer_class(self):
        response = Response.objects.get(id=self.kwargs.get('pk'))
        if response.author == self.request.user:  # TODO: modify after implementing friendship
            return fs.ResponseFriendSerializer
        return fs.ResponseAnonymousSerializer


class FriendFeedPostList(generics.ListAPIView):
    """
    List friend feed posts
    """
    queryset = Post.objects.friend_posts_only()
    serializer_class = fs.PostFriendSerializer
    permission_classes = [permissions.IsAuthenticated]


class AnonymousFeedPostList(generics.ListAPIView):
    """
    List anonymous feed posts
    """
    queryset = Post.objects.anonymous_posts_only()
    serializer_class = fs.PostAnonymousSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserFeedPostList(generics.ListAPIView):
    """
    List feed posts for user page
    """
    serializer_class = fs.PostFriendSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.friend_posts_only().filter(author_id=self.kwargs.get('pk'))
