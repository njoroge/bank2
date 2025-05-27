from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db import transaction as db_transaction # Renamed to avoid conflict with model name

from rest_framework import generics, status, permissions, views
from rest_framework.response import Response

from .models import Account, Transaction
from .serializers import AccountSerializer, TransactionSerializer, DepositWithdrawSerializer
from .permissions import IsAccountOwner, IsAccountOwnerOrAdminOrTeller, CanDepositWithdraw
from users.permissions import IsAdminRole # Changed to absolute import

User = get_user_model()

class UserAccountDetailsView(generics.RetrieveAPIView):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated] # Base permission

    def get_object(self):
        # Retrieve the account for the currently authenticated user
        try:
            # Using select_related to fetch user details in the same query if needed by serializer
            account = Account.objects.select_related('user').get(user=self.request.user)
            # Check object-level permission after retrieving the object
            self.check_object_permissions(self.request, account) # This will use get_permissions()
            return account
        except Account.DoesNotExist:
            # Re-raise as a DRF exception that results in a 404
            raise status.HTTP_404_NOT_FOUND
    
    def get_permissions(self):
        # Add IsAccountOwner for object-level check on the retrieved account
        return [permissions.IsAuthenticated(), IsAccountOwner()]


class DepositView(views.APIView):
    permission_classes = [permissions.IsAuthenticated] # Further permission checks in post

    def post(self, request, *args, **kwargs):
        serializer = DepositWithdrawSerializer(data=request.data)
        if serializer.is_valid():
            account_number = serializer.validated_data['account_number']
            amount = serializer.validated_data['amount']
            description = serializer.validated_data.get('description', 'Deposit')

            try:
                account = Account.objects.get(account_number=account_number)
            except Account.DoesNotExist:
                return Response({"error": "Account not found."}, status=status.HTTP_404_NOT_FOUND)

            # Manually check object-level permissions using CanDepositWithdraw
            permission_checker = CanDepositWithdraw()
            if not permission_checker.has_object_permission(request, self, account):
                 return Response({"error": "You do not have permission to deposit to this account."}, status=status.HTTP_403_FORBIDDEN)

            with db_transaction.atomic(): # Use the renamed import
                account.balance += amount
                account.save()
                
                Transaction.objects.create(
                    account=account,
                    transaction_type='deposit',
                    amount=amount,
                    balance_after_transaction=account.balance,
                    description=description
                )
            
            account_serializer = AccountSerializer(account)
            return Response(account_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WithdrawView(views.APIView):
    permission_classes = [permissions.IsAuthenticated] # Further permission checks in post

    def post(self, request, *args, **kwargs):
        serializer = DepositWithdrawSerializer(data=request.data)
        if serializer.is_valid():
            account_number = serializer.validated_data['account_number']
            amount = serializer.validated_data['amount']
            description = serializer.validated_data.get('description', 'Withdrawal')

            try:
                account = Account.objects.get(account_number=account_number)
            except Account.DoesNotExist:
                return Response({"error": "Account not found."}, status=status.HTTP_404_NOT_FOUND)
            
            # Manually check object-level permissions
            permission_checker = CanDepositWithdraw()
            if not permission_checker.has_object_permission(request, self, account):
                 return Response({"error": "You do not have permission to withdraw from this account."}, status=status.HTTP_403_FORBIDDEN)

            if account.balance < amount:
                return Response({"error": "Insufficient funds."}, status=status.HTTP_400_BAD_REQUEST)

            with db_transaction.atomic(): # Use the renamed import
                account.balance -= amount
                account.save()

                Transaction.objects.create(
                    account=account,
                    transaction_type='withdrawal',
                    amount=amount,
                    balance_after_transaction=account.balance,
                    description=description
                )
            
            account_serializer = AccountSerializer(account)
            return Response(account_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AccountTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated] # Base permission

    def get_queryset(self):
        account_number = self.kwargs.get('account_number')
        if not account_number:
             # This case might not be hit if URL routing always provides account_number
            raise status.HTTP_400_BAD_REQUEST("Account number not provided in URL.")

        try:
            account = Account.objects.get(account_number=account_number)
        except Account.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND("Account not found.")

        # Manually check object-level permission after retrieving the account
        permission_checker = IsAccountOwnerOrAdminOrTeller()
        if not permission_checker.has_object_permission(self.request, self, account):
            self.permission_denied(
                self.request, 
                message=getattr(permission_checker, 'message', "You do not have permission to view these transactions.")
            )
        
        return Transaction.objects.filter(account=account).order_by('-created_at')

# Admin Views
class AdminAccountListView(generics.ListAPIView):
    queryset = Account.objects.select_related('user').all().order_by('id')
    serializer_class = AccountSerializer
    permission_classes = [IsAdminRole] # Using custom IsAdminRole

class AdminAccountDetailView(generics.RetrieveAPIView):
    queryset = Account.objects.select_related('user').all()
    serializer_class = AccountSerializer
    permission_classes = [IsAdminRole] # Using custom IsAdminRole
    lookup_field = 'account_number'

class AdminTransactionListView(generics.ListAPIView):
    queryset = Transaction.objects.select_related('account', 'account__user').all().order_by('-created_at')
    serializer_class = TransactionSerializer
    permission_classes = [IsAdminRole] # Using custom IsAdminRole
    # TODO: Add filtering if required, e.g., using django-filter
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['transaction_type', 'account__account_number', 'created_at']
    # For date range filtering on 'created_at', a RangeFilter can be used.
    # Example: filterset_class = TransactionFilter (custom filter class)
    # This is a placeholder for now.
    pass
