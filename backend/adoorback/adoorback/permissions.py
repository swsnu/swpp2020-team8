from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow recipients of noti to update.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class IsShared(permissions.BasePermission):
    """
    Custom permission to only allow friends of author to view author profile.
    """

    def has_object_permission(self, request, view, obj):
        from django.contrib.auth import get_user_model
        User = get_user_model()

        if obj.type == 'Question' or obj.share_anonymously:
            return True
        elif obj.share_with_friends and User.are_friends(request.user, obj.author):
            return True
        else:
            return obj.author == request.user
