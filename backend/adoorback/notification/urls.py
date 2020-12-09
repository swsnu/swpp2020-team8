from django.urls import path

from notification import views

urlpatterns = [
    path('', views.NotificationList.as_view(), name='notification-list'),
    path('unread?=', views.notification_id, name='notification-id'),
    path('<int:pk>/', views.NotificationDetail.as_view(), name='notification-update'),
]
