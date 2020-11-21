from django.urls import path

from notification import views

urlpatterns = [
    path('', views.NotificationList.as_view(), name='notification-list'),
    path('<int:pk>/', views.NotificationDetail.as_view(), name='notification-destroy'),
]