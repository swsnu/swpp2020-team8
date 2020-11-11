from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the author of the object.
        if obj.type == 'Like':
            return obj.user == request.user
        return obj.author == request.user
