from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from account.serializers import UserProfileSerializer, UserDetailedSerializer
from feed.serializers import QuestionSerializer
from feed.models import Question

User = get_user_model()


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]


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
