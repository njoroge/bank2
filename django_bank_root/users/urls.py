from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserMeView,
    AdminUserListView,
    AdminUserDetailView
)

app_name = 'users' # Optional: define an app namespace

urlpatterns = [
    path('auth/register/', UserRegistrationView.as_view(), name='user-register'),
    path('auth/login/', UserLoginView.as_view(), name='token_obtain_pair'), # Name as per SimpleJWT docs
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Name as per SimpleJWT docs
    path('auth/me/', UserMeView.as_view(), name='user-me'),
    
    # Admin User Management URLs
    # These are prefixed with 'admin/' as per the plan, e.g. /api/admin/users/
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
]
