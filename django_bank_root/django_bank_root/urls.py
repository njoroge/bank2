"""
URL configuration for django_bank_root project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path # Added re_path
from django.views.generic import TemplateView # Added TemplateView

urlpatterns = [
    path('admin/', admin.site.urls), # Django admin site
    # For users app: handles /api/auth/* and /api/admin/users/*
    path('api/', include('users.urls')), 
    # For accounts app: handles /api/accounts/* and /api/admin/accounts/*, /api/admin/transactions/*
    path('api/', include('accounts.urls')), 
]

# Catch-all for React SPA (must be last)
# This serves index.html for any route not matched above (and not an API route, implicitly)
# For more robust non-API route handling, one might use a regex like r'^(?!api/).*$'
# but for simplicity, if API routes are all under /api/, any other GET request can serve index.html.
# However, the problem description specifically asks for '^(?!api/).*$'
urlpatterns += [
    re_path(r'^(?!api/).*$', 
            TemplateView.as_view(template_name="index.html"), 
            name='react-app'),
]
