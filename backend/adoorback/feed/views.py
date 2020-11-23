import json

from django.contrib.auth import get_user_model
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.utils import timezone
from rest_framework import generics
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response as DRF_Response
from rest_framework.decorators import api_view
from celery.schedules import crontab
from celery.task import periodic_task

import feed.serializers as fs
from feed.models import Article, Response, Question, Post, ResponseRequest
from adoorback.permissions import IsOwnerOrReadOnly, IsShared

User = get_user_model()

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


class ResponseRequestList(generics.ListAPIView):
    """
    Get response requests of the selected question.
    Create ResponseRequest of the selected question.
    """
    serializer_class = fs.ResponseRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        question_id = self.kwargs['pk']
        current_user_sent_response_request_set = self.request.user.sent_response_request_set.all()
        responseRequests = current_user_sent_response_request_set.filter(question_id=question_id)
        return responseRequests

@api_view(["POST", "PATCH", "DELETE"])
def response_request_detail(request, qid, rid):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    try:
        recipient = User.objects.get(id=rid)
        question = Question.objects.get(id=qid)
    except (User.DoesNotExist, Question.DoesNotExist):
        return HttpResponse(status=404)

    #TODO: 친구에게만 질문 보내기 가능
    if request.method == 'POST':
        new_response_request = ResponseRequest(actor=request.user, recipient=recipient, question=question)
        new_response_request.save()
        serializer = fs.ResponseRequestSerializer(new_response_request)
        return DRF_Response(serializer.data, status=status.HTTP_201_CREATED)

    elif request.method == 'PATCH':
        try:
            response_request = ResponseRequest.objects.get(question_id=qid, recipient_id=rid)
        except ResponseRequest.DoesNotExist:
            return HttpResponse(status=404)

        if request.user.id == response_request.recipient.id:
            try:
                new_responded = json.loads(request.body)['responded']
                response_request.responded = new_responded
                response_request.save()
                serializer = fs.ResponseRequestSerializer(response_request)
                return DRF_Response(serializer.data, status=status.HTTP_200_OK)
            except (KeyError, json.JSONDecodeError):
                return HttpResponseBadRequest()
        else:
            return HttpResponse(status=403)

    elif request.method == 'DELETE':
        try:
            response_request = ResponseRequest.objects.get(question_id=qid, recipient_id=rid)
        except ResponseRequest.DoesNotExist:
            return HttpResponse(status=404)

        if request.user.id == response_request.actor.id:
            response_request.delete()
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=403)

    return HttpResponseNotAllowed(['GET'])

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
