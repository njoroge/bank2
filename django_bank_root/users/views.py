from django.contrib.auth import get_user_model
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserRegistrationSerializer, UserSerializer, AdminUserUpdateSerializer
from .permissions import IsAdminRole # Using custom IsAdminRole

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny] # Anyone can register

class UserLoginView(TokenObtainPairView):
    # This view uses the default serializer from rest_framework_simplejwt.serializers.TokenObtainPairSerializer
    # which expects 'username' and 'password'. Since our User model has USERNAME_FIELD = 'account_number',
    # users will need to send 'account_number' and 'password' in the request body.
    pass

class UserMeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class AdminUserListView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by('id')
    permission_classes = [IsAdminRole] # Using custom IsAdminRole for admin access

    def get_serializer_class(self):
        if self.request.method == 'POST':
            # Admin creating a user, can specify roles etc.
            return UserRegistrationSerializer 
        return UserSerializer # For listing users

class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAdminRole] # Using custom IsAdminRole for admin access
    lookup_field = 'pk' # 'pk' or 'id' should work by default. Using 'pk' for consistency.

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']: # Handle both PUT and PATCH for updates
            return AdminUserUpdateSerializer # For updating specific admin-controlled fields
        return UserSerializer # For retrieving user details
