from django.urls import path

from comment import views

urlpatterns = [
    path('', views.CommentList.as_view(), name='comment-list'),
    path('<int:pk>/', views.CommentDetail.as_view(), name='comment-detail'),
]
