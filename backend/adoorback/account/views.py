from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from rest_framework import generics

from account.serializers import UserProfileSerializer, UserDetailedSerializer
from feed.serializers import QuestionSerializer
from feed.models import Question

User = get_user_model()


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        queryset = User.objects.filter(id=self.request.user.id)
        if self.request.user.is_superuser:
            queryset = User.objects.all()
        return queryset


class UserCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailedSerializer


class SignupQuestionList(generics.ListAPIView):
    queryset = Question.objects.all().order_by('?')[:5]
    serializer_class = QuestionSerializer
    model = serializer_class.Meta.model
