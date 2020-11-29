"""adoorback URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

urlpatterns = [
    path('api/likes/', include('like.urls')),
    path('api/comments/', include('comment.urls')),
    path('api/notifications/', include('notification.urls')),
    path('api/feed/', include('feed.urls')),
    path('api/user/', include('account.urls')),
    path('api/admin/', include('admin_honeypot.urls', namespace='admin_honeypot')),
    path('api/secret/', admin.site.urls),
    path('api/user/', include('rest_framework.urls', namespace='rest_framework')),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
