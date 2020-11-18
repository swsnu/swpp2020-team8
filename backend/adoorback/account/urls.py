from django.urls import path
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from account import views


urlpatterns = [
    path('', views.UserList.as_view(), name='user-list'),
    path('me/', views.current_user, name='current-user'),
    path('login/', views.user_login, name='user-login'),
    path('signup/', views.UserSignup.as_view(), name='user-signup'),
    path('<int:pk>/info/', views.UserInfo.as_view(), name='user-info'),
    path('<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
    path('select-questions/', views.SignupQuestions.as_view(),
         name='signup-questions'),
    path('token/', ensure_csrf_cookie(TokenObtainPairView.as_view()),
         name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token-verify'),
    path('<int:pk>/friends/', views.UserFriendList.as_view(),
         name='user-friend-list'),
    # path('friendship/<int:pk>/', name='user-friendship'),
    # path('friend-requests/<int:pk>/', name='user-friend-request)
]
