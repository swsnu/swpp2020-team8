from django.urls import path
from account import views

urlpatterns = [
    path('', views.UserList.as_view(), name='user-list'),
    path('<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
    path('select-questions/', views.SignupQuestionList.as_view(), name='signup-question-list'),
    path('token/', views.token, name='token'),
]
