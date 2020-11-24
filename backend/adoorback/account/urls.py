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
    path('signup/', views.user_signup, name='user-signup'),
    path('select-questions/', views.SignupQuestions.as_view(),
         name='signup-questions'),
    path('me/', views.current_user, name='current-user'),

    # Token related
    path('token/', ensure_csrf_cookie(TokenObtainPairView.as_view()),
         name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token-verify'),

    # Friendship related
    path('<int:pk>/friends/', views.UserFriendList.as_view(),
         name='user-friend-list'),
    path('friendship/<int:fid>/', views.UserFriendshipDetail.as_view(),
         name='user-friend-detail'),
]
