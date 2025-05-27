from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'account_number', 'first_name', 'last_name', 'password', 
                  'is_admin_role', 'is_teller_role', 'is_clerk_role', 'is_customer_role')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Extract role fields, defaulting to False if not provided, except for customer_role
        is_admin_role = validated_data.pop('is_admin_role', False)
        is_teller_role = validated_data.pop('is_teller_role', False)
        is_clerk_role = validated_data.pop('is_clerk_role', False)
        # If is_customer_role is not provided, it defaults to True as per model definition,
        # but it's good practice to handle it explicitly if it's part of the serializer fields.
        is_customer_role = validated_data.pop('is_customer_role', True)


        user = User.objects.create_user(
            account_number=validated_data['account_number'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            is_admin_role=is_admin_role,
            is_teller_role=is_teller_role,
            is_clerk_role=is_clerk_role,
            is_customer_role=is_customer_role
            # Other fields like is_staff, is_superuser are handled by create_superuser or direct assignment if needed
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'account_number', 'first_name', 'last_name', 
                  'is_admin_role', 'is_teller_role', 'is_clerk_role', 'is_customer_role', 
                  'date_joined', 'is_active') # Added is_active as it's useful

class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('is_admin_role', 'is_teller_role', 'is_clerk_role', 'is_customer_role', 'is_active')
