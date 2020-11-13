from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from adoorback.permissions import IsOwnerOrReadOnly
from account.serializers import UserProfileSerializer, UserDetailedSerializer, UserRegistrationSerializer
from feed.serializers import QuestionSerializer
from feed.models import Question

User = get_user_model()


class UserRegister(generics.GenericAPIView):
    serializer_class = UserProfileSerializer

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'],
                                        email=validated_data['email'],
                                        password=validated_data['password'])
        return user


class SignupQuestionList(generics.ListAPIView):
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


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailedSerializer
    permission_classes = [IsAuthenticated]


class UserInfo(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
