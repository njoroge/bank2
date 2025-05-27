from django.urls import path
from .views import (
    UserAccountDetailsView,
    DepositView,
    WithdrawView,
    AccountTransactionListView,
    AdminAccountListView,
    AdminAccountDetailView,
    AdminTransactionListView
)

app_name = 'accounts' # Optional: define an app namespace

urlpatterns = [
    # User-facing account URLs (will be prefixed with /api/accounts/ by main urls.py)
    path('accounts/my-account/', UserAccountDetailsView.as_view(), name='user-account-details'),
    path('accounts/deposit/', DepositView.as_view(), name='account-deposit'),
    path('accounts/withdraw/', WithdrawView.as_view(), name='account-withdraw'),
    path('accounts/<str:account_number>/transactions/', AccountTransactionListView.as_view(), name='account-transactions'),
    
    # Admin Account & Transaction Management URLs (will be prefixed with /api/admin/ by main urls.py)
    # To achieve the /api/admin/accounts structure, these paths will be relative to the include in the main urls.py
    # If main urls.py includes accounts.urls under 'api/', these will become:
    # /api/admin/accounts/
    # /api/admin/accounts/<account_number>/
    # /api/admin/transactions/
    path('admin/accounts/', AdminAccountListView.as_view(), name='admin-account-list'),
    path('admin/accounts/<str:account_number>/', AdminAccountDetailView.as_view(), name='admin-account-detail'),
    path('admin/transactions/', AdminTransactionListView.as_view(), name='admin-transaction-list'),
]
