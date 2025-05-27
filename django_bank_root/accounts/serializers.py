from rest_framework import serializers
from .models import Account, Transaction
from django.contrib.auth import get_user_model
# Changed to absolute import due to "attempted relative import beyond top-level package" error with older Django
from users.serializers import UserSerializer 

User = get_user_model()

class AccountSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # Renamed from userId to user_id for consistency with Django field naming conventions
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='user',  # This links it to the 'user' model field
        write_only=True
    )

    class Meta:
        model = Account
        fields = ('id', 'user', 'user_id', 'account_number', 'balance', 'created_at')
        # 'user_id' is for writing, 'user' (UserSerializer) is for reading.

class TransactionSerializer(serializers.ModelSerializer):
    # If transactions are always created via a nested route like /accounts/<pk>/transactions/,
    # then 'account' could be read_only=True and set in the view.
    # Using PrimaryKeyRelatedField allows specifying the account by ID directly.
    account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())

    class Meta:
        model = Transaction
        fields = ('id', 'account', 'transaction_type', 'amount', 
                  'balance_after_transaction', 'description', 'created_at')
        read_only_fields = ('balance_after_transaction',) # Typically calculated by the server

class DepositWithdrawSerializer(serializers.Serializer):
    account_number = serializers.CharField(max_length=50)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    description = serializers.CharField(max_length=200, required=False, allow_blank=True, allow_null=True)

    def validate_amount(self, value):
        """
        Check that the amount is positive.
        """
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value

    # Optional: You might want to add a validate_account_number method
    # if you need to check its existence or format during serialization.
    # def validate_account_number(self, value):
    #     if not Account.objects.filter(account_number=value).exists():
    #         raise serializers.ValidationError("Account not found.")
    #     return value
