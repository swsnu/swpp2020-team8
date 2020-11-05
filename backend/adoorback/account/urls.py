from django.urls import path
from account import views

urlpatterns = [
    path('api/user/', views.UserList.as_view(), name='user-list'),
    path('api/user/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
]
