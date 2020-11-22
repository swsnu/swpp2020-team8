from django.urls import path
from feed import views

urlpatterns = [
    path('articles/', views.ArticleList.as_view(), name='article-list'),
    path('articles/<int:pk>/', views.ArticleDetail.as_view(), name='article-detail'),
    path('responses/', views.ResponseList.as_view(), name='response-list'),
    path('responses/<int:pk>/', views.ResponseDetail.as_view(), name='response-detail'),
    path('questions/', views.QuestionList.as_view(), name='question-list'),
    path('questions/<int:pk>/', views.QuestionDetail.as_view(), name='question-detail'),
    path('questions/daily/', views.DailyQuestionList.as_view(), name='daily-question-list'),
    path('friend/', views.FriendFeedPostList.as_view(), name='friend-feed-post-list'),
    path('anonymous/', views.AnonymousFeedPostList.as_view(), name='anonymous-feed-post-list'),
    path('user/<int:pk>/', views.UserFeedPostList.as_view(), name='user-feed-post-list'),
]
