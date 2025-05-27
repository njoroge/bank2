from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model
from .models import Account # Assuming Account model is in the same app

User = get_user_model()

class IsAccountOwner(BasePermission):
    """
    Custom permission to only allow owners of an account to view/edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Instance must be an Account model.
        if isinstance(obj, Account):
            return obj.user == request.user
        # If the object is a User instance (e.g. for a view that lists accounts for a user)
        # this check might be relevant if the view's get_object returns a User.
        # However, for typical Account views, obj will be an Account.
        # Consider if this User check is truly needed here or if it's better handled in a user-specific permission.
        # if isinstance(obj, User):
        #     return obj == request.user
        return False

class IsAccountOwnerOrAdminOrTeller(BasePermission):
    """
    Allows access if the user is the account owner, an admin, or a teller.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_admin_role or request.user.is_teller_role:
            return True
        
        # Check for account ownership if obj is an Account
        if isinstance(obj, Account):
            return obj.user == request.user
        return False

class CanDepositWithdraw(BasePermission):
    """
    Permission to check if a user can deposit or withdraw from an account.
    Allows admin, teller, or the account owner.
    """
    def has_permission(self, request, view):
        # This check can be basic, detailed checks are in has_object_permission
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # obj is expected to be an Account instance
        if not request.user or not request.user.is_authenticated:
            return False
            
        if not isinstance(obj, Account):
            return False # Not an account object, deny permission

        if request.user.is_admin_role or request.user.is_teller_role:
            return True
        
        return obj.user == request.user
