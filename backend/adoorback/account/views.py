from django.contrib.auth import get_user_model, authenticate, login
from django.http import JsonResponse, HttpResponse, HttpResponseNotAllowed
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


class UserSignup(generics.CreateAPIView):
    serializer_class = UserProfileSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def user_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    login(request, user)
    return Response(status=HTTP_200_OK)


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
