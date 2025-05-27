from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Account, Transaction

class AccountTransactionTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            account_number='testuser1', 
            first_name='Test', 
            last_name='User1', 
            password='password123'
        )
        # Ensure the account_number for the Account matches the User's account_number
        self.account = Account.objects.create(
            user=self.user, 
            account_number=self.user.account_number,  # Use user's account_number
            balance=1000.00
        )

    def test_create_account(self):
        self.assertIsNotNone(self.account)
        self.assertEqual(self.account.user, self.user)
        self.assertEqual(Account.objects.count(), 1)
        self.assertEqual(self.account.balance, 1000.00)
        self.assertEqual(self.account.account_number, 'testuser1')


    def test_create_transaction(self):
        transaction = Transaction.objects.create(
            account=self.account, 
            transaction_type='deposit', 
            amount=500.00, 
            balance_after_transaction=1500.00 # Manually setting for test; service would calculate this
        )
        self.assertIsNotNone(transaction)
        self.assertEqual(self.account.transactions.count(), 1)
        self.assertEqual(transaction.amount, 500.00)
        self.assertEqual(transaction.balance_after_transaction, 1500.00)
