from django.urls import path
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from account import views

urlpatterns = [
    # User Profile related
    path('', views.UserList.as_view(), name='user-list'),
    path(r'search/', views.UserSearch.as_view(), name='user-search'),
    path('<int:pk>/', views.UserDetail.as_view(), name='user-detail'),

    # Auth related
    path('login/', views.user_login, name='user-login'),
    path('signup/', views.UserSignup.as_view(), name='user-signup'),
    path('select-questions/', views.SignupQuestions.as_view(),
         name='signup-questions'),

    # Current User Related
    path('me/', views.CurrentUserProfile.as_view(), name='current-user'),
    path('me/friends/', views.CurrentUserFriendList.as_view(), name='current-user-friends'),

    # Token related
    path('token/anonymous/', views.token_anonymous, name="token-anonymous"),
    path('token/', ensure_csrf_cookie(TokenObtainPairView.as_view()),
         name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token-verify'),

    # Friendship related
    path('friend/<int:pk>/', views.UserFriendDestroy.as_view(), name='user-friend-destroy'),

    # FriendRequest related
    path('friend-requests/', views.UserFriendRequestList.as_view(),
         name='user-friend-request-list'),
    path('friend-requests/<int:pk>/', views.UserFriendRequestDestroy.as_view(),
         name='user-friend-request-destroy'),
    path('friend-requests/<int:pk>/respond/', views.UserFriendRequestUpdate.as_view(),
         name='user-friend-request-update'),
]
