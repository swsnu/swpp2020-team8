from django.urls import path
from account import views


app_name = "accounts"

urlpatterns = [
    path('', views.UserList.as_view(), name='user-list'),
    path('signup/', views.UserCreate.as_view(), name='user-create'),
    path('<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
    path('select-questions/', views.SignupQuestionList.as_view(), name='signup-question-list'),
]
