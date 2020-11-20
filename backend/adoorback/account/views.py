import json

from django.contrib.auth import get_user_model, authenticate, login
from django.db import DataError, IntegrityError
from django.http import JsonResponse, HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_200_OK

from adoorback.permissions import IsOwnerOrReadOnly
from account.serializers import UserProfileSerializer, UserDetailedSerializer
from feed.serializers import QuestionSerializer
from feed.models import Question

User = get_user_model()


def user_signup(request):
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body)
            username = str(req_data['username'])
            password = str(req_data['password'])
            email = str(req_data['email'])

        except (KeyError, TypeError, json.JSONDecodeError):
            return HttpResponseBadRequest()

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password)
        except (DataError, IntegrityError):
            return HttpResponseBadRequest()

        user.refresh_from_db()
        user.save()

        return HttpResponse(status=201)

    return HttpResponseNotAllowed(['POST'])


def user_login(request):
    if request.method == "POST":
        try:
            req_data = json.loads(request.body)
            username = str(req_data['username'])
            password = str(req_data['password'])
        except (KeyError, TypeError, json.JSONDecodeError):
            return HttpResponseBadRequest()

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse(status=204)
        return HttpResponse(status=401)

    return HttpResponseNotAllowed(['POST'])


class SignupQuestions(generics.ListAPIView):
    queryset = Question.objects.all().order_by('?')[:5]
    serializer_class = QuestionSerializer
    model = serializer_class.Meta.model


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.filter(id=self.request.user.id)
        if self.request.user.is_superuser:
            queryset = User.objects.all()
        return queryset


def current_user(request):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        serializer = UserProfileSerializer(request.user)
        return JsonResponse(serializer.data, safe=False, status=200)
    return HttpResponseNotAllowed(['GET'])


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailedSerializer
    permission_classes = [IsAuthenticated]


class UserInfo(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]


class UserSearch(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.filter(username__icontains=self.request.GET.get('query'))
        return queryset
