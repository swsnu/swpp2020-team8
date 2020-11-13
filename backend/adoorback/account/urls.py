from django.urls import path
from account import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView


urlpatterns = [
    path('', views.UserList.as_view(), name='user-list'),
    path('signup/', views.UserRegister.as_view(), name='user-register'),
    path('<int:pk>/info/', views.UserInfo.as_view(), name='user-info'),
    path('<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
    path('select-questions/', views.SignupQuestions.as_view(), name='signup-questions'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token-verify'),
]
