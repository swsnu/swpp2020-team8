import json

from django.contrib.auth import get_user_model, authenticate, login
from django.http import JsonResponse, HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from rest_framework import generics
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer

from adoorback.permissions import IsOwnerOrReadOnly
from account.models import Friendship
from account.serializers import UserProfileSerializer, AuthorFriendSerializer, UserFriendshipDetailSerializer
from feed.serializers import QuestionAnonymousSerializer
from feed.models import Question

User = get_user_model()


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super().__init__(content, **kwargs)


def user_signup(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = UserProfileSerializer(data=data,
                                           context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=201)
        return JSONResponse(serializer.errors, status=400)

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
    serializer_class = QuestionAnonymousSerializer
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
        serializer = UserProfileSerializer(
            request.user, context={'request': request})
        return JsonResponse(serializer.data, safe=False, status=200)
    return HttpResponseNotAllowed(['GET'])


class UserDetail(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]


class UserSearch(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.filter(
            username__icontains=self.request.GET.get('query'))
        return queryset


class UserFriendList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = AuthorFriendSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = []
        friendship_set = self.request.user.friends.all()
        for friendship in friendship_set:
            queryset.append(friendship.friend)
        return queryset


class UserFriendshipDetail(generics.CreateAPIView, generics.RetrieveDestroyAPIView):
    """
    Retrieve or destroy a friendship.
    """
    queryset = Friendship.objects.all()
    serializer_class = UserFriendshipDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = queryset.get(user_id=self.request.user.id,
                           friend_id=self.kwargs.get('fid'))
        self.check_object_permissions(self.request, obj)
        return obj
