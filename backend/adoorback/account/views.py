from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from rest_framework import generics

from account.serializers import UserProfileSerializer
from feed.serializers import QuestionSerializer
from feed.models import Question
User = get_user_model()


class SignupQuestionList(generics.ListAPIView):
    queryset = Question.objects.all().order_by('?')[:5]
    serializer_class = QuestionSerializer
    model = serializer_class.Meta.model


class UserList(generics.ListCreateAPIView):
    """
    List all users, or create a new user.
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or destroy a user.
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer


@require_http_methods(['GET'])
@ensure_csrf_cookie
def token(request):
    return HttpResponse(status=204)
