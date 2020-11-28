import os
import pandas as pd

from django.contrib.auth import get_user_model
from django.http import HttpResponseBadRequest
from rest_framework import generics
from rest_framework import permissions

import feed.serializers as fs
from feed.models import Article, Response, Question, Post, ResponseRequest
from feed.algorithms.data_crawler import select_daily_questions
from adoorback.permissions import IsOwnerOrReadOnly, IsShared

User = get_user_model()

class FriendFeedPostList(generics.ListAPIView):
    """
    List friend feed posts
    """
    serializer_class = fs.PostFriendSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        current_user = self.request.user
        queryset = Post.objects.friend_posts_only().filter(author_id__in=current_user.friend_ids) | \
                   Post.objects.filter(author_id=current_user.id)
        return queryset


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


class ArticleList(generics.CreateAPIView):
    """
    List all articles, or create a new article.
    """
    queryset = Article.objects.all()
    serializer_class = fs.ArticleFriendSerializer
    permission_classes = [permissions.IsAuthenticated]

    # # for get list only
    # def get_queryset(self):
    #     current_user = self.request.user
    #     friend_ids = current_user.friends.values_list('friend_id', flat=True)
    #     queryset = Article.objects.filter(author_id__in=friend_ids) | \
    #                Article.objects.filter(share_anonymously=True) | \
    #                Article.objects.filter(author_id=current_user.id)
    #     return queryset

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
        if User.are_friends(self.request.user, article.author):
            return fs.ArticleFriendSerializer
        return fs.ArticleAnonymousSerializer


class ResponseList(generics.ListCreateAPIView):
    """
    List all responses, or create a new response.
    """
    queryset = Response.objects.all()
    serializer_class = fs.ResponseFriendSerializer
    permission_classes = [permissions.IsAuthenticated]

    # # for get list only
    # def get_queryset(self):
    #     current_user = self.request.user
    #     friend_ids = current_user.friends.values_list('friend_id', flat=True)
    #     queryset = Response.objects.filter(author_id__in=friend_ids) | \
    #                Response.objects.response_set.filter(share_anonymously=True) | \
    #                Response.objects.filter(author_id=current_user.id)
    #     return queryset

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
        if User.are_friends(self.request.user, response.author):
            return fs.ResponseFriendSerializer
        return fs.ResponseAnonymousSerializer


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


class ResponseRequestList(generics.ListAPIView):
    """
    Get response requests of the selected question.
    """
    serializer_class = fs.ResponseRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        try:
            question = Question.objects.get(id=self.kwargs['qid'])
        except Question.DoesNotExist:
            return HttpResponseBadRequest
        sent_response_request_set = self.request.user.sent_response_request_set.all()
        responseRequests = sent_response_request_set.filter(question=question).order_by('-created_at')
        return responseRequests


class ResponseRequestCreate(generics.CreateAPIView):
    """
    Get response requests of the selected question.
    """
    queryset = ResponseRequest.objects.all()
    serializer_class = fs.ResponseRequestSerializer
    permission_classes = [permissions.IsAuthenticated]


class ResponseRequestDestroy(generics.DestroyAPIView):
    serializer_class = fs.ResponseRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return ResponseRequest.objects.get(requester_id=self.kwargs.get('rid'),
                                           requestee_id=self.request.user.id,
                                           question_id=self.kwargs.get('qid'))


class DailyQuestionList(generics.ListAPIView):
    serializer_class = fs.QuestionResponsiveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if Question.objects.daily_questions().count() == 0:
            select_daily_questions()
        return Question.objects.daily_questions().order_by('-id')


class RecommendedQuestionList(generics.ListAPIView):
    serializer_class = fs.QuestionBaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        dir_name = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(dir_name, 'algorithms', 'recommendations.csv')
        df = pd.read_csv(path)
        df = df[df.userId == self.request.user.id]
        rank_ids = df['questionId'].tolist()
        daily_question_ids = set(list(Question.objects.daily_questions().values_list('id', flat=True)))
        recommended_ids = [x for x in rank_ids if x in daily_question_ids][:5]

        return Question.objects.filter(pk__in=recommended_ids).order_by('-id')
