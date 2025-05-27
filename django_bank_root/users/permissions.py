from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model

User = get_user_model()

class IsAdminRole(BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_role)

class IsTellerRole(BasePermission):
    """
    Allows access only to teller users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_teller_role)

class IsClerkRole(BasePermission):
    """
    Allows access only to clerk users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_clerk_role)

class IsOwner(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has a `user` attribute or is the user itself.
    """
    def has_object_permission(self, request, view, obj):
        # For User model instances, obj is the user itself.
        if isinstance(obj, User):
            return obj == request.user
        # For other models that have a 'user' attribute (e.g., an Account model)
        # This might be more generic than needed here, consider specific permissions like IsAccountOwner.
        return obj.user == request.user
