from rest_framework import permissions


class IsCurrentUserOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj == request.user


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
        return obj.recipient == request.user


class IsRequesteeOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow requestees of a request to respond
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.requestee == request.user


class IsRequesterOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow requesters to cancel (destroy) a request
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.requester == request.user


class IsShared(permissions.BasePermission):
    """
    Custom permission to only allow friends of author to view author profile.
    """

    def has_object_permission(self, request, view, obj):
        from django.contrib.auth import get_user_model
        User = get_user_model()

        if obj.share_anonymously or obj.type == 'Question':
            return True
        elif obj.share_with_friends and User.are_friends(request.user, obj.author):
            return True
        else:
            return obj.author == request.user
