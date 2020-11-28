from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from account.models import FriendRequest


User = get_user_model()
admin.site.register(User, UserAdmin)
admin.site.register(FriendRequest)
