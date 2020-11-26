from django.urls import path

from notification import views

urlpatterns = [
    path('', views.notification_list, name='notification-list'),
    path('<int:pk>/', views.NotificationDetail.as_view(), name='notification-update'),
]