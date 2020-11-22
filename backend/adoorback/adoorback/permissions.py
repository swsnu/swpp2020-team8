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

class IsRecipient(permissions.BasePermission):
    """
    Custom permission to only allow recipients of noti to update.
    """

    def has_object_permission(self, request, view, obj):
        return obj.recipient == request.user
