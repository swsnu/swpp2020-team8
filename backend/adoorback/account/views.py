import json

from django.contrib.auth import get_user_model, authenticate, login
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from account.models import FriendRequest
from account.serializers import UserProfileSerializer, \
    UserFriendRequestCreateSerializer, UserFriendRequestUpdateSerializer, \
    UserFriendshipStatusSerializer, AuthorFriendSerializer
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
    queryset = Question.objects.order_by('?')[:5]
    serializer_class = QuestionAnonymousSerializer
    model = serializer_class.Meta.model
    permission_classes = [IsAuthenticated]


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.filter(id=self.request.user.id)
        if self.request.user.is_superuser:
            queryset = User.objects.all()
        return queryset


class CurrentUserFriendList(generics.ListAPIView):
    serializer_class = AuthorFriendSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.friends.all()


class CurrentUserProfile(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # since the obtained user object is the authenticated user,
        # no further permission checking unnecessary
        return User.objects.get(id=self.request.user.id)

    def perform_update(self, serializer):
        if serializer.is_valid(raise_exception=True):
            serializer.save()


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserFriendshipStatusSerializer
    permission_classes = [IsAuthenticated]


class UserSearch(generics.ListAPIView):
    serializer_class = UserFriendshipStatusSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.GET.get('query')
        queryset = User.objects.none()
        if query:
            queryset = User.objects.filter(
                username__icontains=self.request.GET.get('query'))
        return queryset


class UserFriendDestroy(generics.DestroyAPIView):
    """
    Destroy a friendship.
    """
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, obj):
        obj.friends.remove(self.request.user)


class UserFriendRequestList(generics.ListCreateAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = UserFriendRequestCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FriendRequest.objects.filter(requestee=self.request.user)

    def perform_create(self, serializer):
        if int(self.request.data.get('requester_id')) != int(self.request.user.id):
            raise PermissionDenied("requester가 본인이 아닙니다...")
        serializer.save(accepted=None)


class UserFriendRequestDestroy(generics.DestroyAPIView):
    serializer_class = UserFriendRequestCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # since the requester is the authenticated user, no further permission checking unnecessary
        return FriendRequest.objects.get(requester_id=self.request.user.id,
                                         requestee_id=self.kwargs.get('pk'))

    def perform_destroy(self, obj):
        obj.delete()


class UserFriendRequestUpdate(generics.UpdateAPIView):
    serializer_class = UserFriendRequestUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # since the requestee is the authenticated user, no further permission checking unnecessary
        return FriendRequest.objects.get(requester_id=self.kwargs.get('pk'),
                                         requestee_id=self.request.user.id)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)  # check `accepted` field
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        return serializer.save()
