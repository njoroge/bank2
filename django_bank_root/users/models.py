from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, account_number, password=None, **extra_fields):
        """
        Creates and saves a User with the given account_number and password.
        """
        if not account_number:
            raise ValueError('The Account Number must be set')
        
        # Normalize the account_number if needed (e.g., account_number = self.normalize_email(account_number) if it were email)
        # For a simple CharField, direct assignment is fine.
        
        extra_fields.setdefault('is_customer_role', True) # Default role

        user = self.model(account_number=account_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, account_number, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given account_number and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin_role', True) # Superusers are typically admin role
        extra_fields.setdefault('is_customer_role', False) # Superusers are not typically customer role

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(account_number, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    account_number = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Required for Django admin access
    date_joined = models.DateTimeField(auto_now_add=True)

    # Role fields
    is_admin_role = models.BooleanField(default=False)
    is_teller_role = models.BooleanField(default=False)
    is_clerk_role = models.BooleanField(default=False)
    is_customer_role = models.BooleanField(default=True) # Default role for new users

    objects = UserManager()

    USERNAME_FIELD = 'account_number'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.account_number

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
