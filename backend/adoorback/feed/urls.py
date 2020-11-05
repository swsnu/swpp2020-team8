from django.urls import path
from feed import views

urlpatterns = [
    path('api/feed/articles/', views.ArticleList.as_view(), name='article-list'),
    path('api/feed/articles/<int:pk>/', views.ArticleDetail.as_view(), name='article-detail'),
]
