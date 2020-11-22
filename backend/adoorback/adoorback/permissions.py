from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        if obj.type == 'Like':
            return obj.user == request.user
        elif obj.type == 'User':
            return obj == request.user
        return obj.author == request.user


class IsShared(permissions.BasePermission):
    """
    Custom permission to only allow friends of author to view author profile.
    """

    def has_object_permission(self, request, view, obj):
        if obj.type == 'Question' or obj.share_anonymously:
            return True
        elif obj.share_with_friends and obj.author == request.user:  # fix after friendship is implemented
            return True
        else:
            return obj.author == request.user
