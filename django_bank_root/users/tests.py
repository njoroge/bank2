from django.test import TestCase
from django.contrib.auth import get_user_model

class UserCreationTests(TestCase):
    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            account_number='testuseracc', 
            first_name='Test', 
            last_name='User', 
            password='testpassword'
        )
        self.assertIsNotNone(user)
        self.assertEqual(user.account_number, 'testuseracc')
        self.assertTrue(user.check_password('testpassword'))
        self.assertTrue(user.is_customer_role) # Default role defined in model
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        User = get_user_model()
        superuser = User.objects.create_superuser(
            account_number='superacc', 
            first_name='Super', 
            last_name='User', 
            password='superpassword'
        )
        self.assertIsNotNone(superuser)
        self.assertEqual(superuser.account_number, 'superacc')
        self.assertTrue(superuser.check_password('superpassword'))
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        # As per our model's create_superuser logic in users/models.py:
        self.assertTrue(superuser.is_admin_role) 
        self.assertFalse(superuser.is_customer_role)

from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

class UserAuthAPITests(APITestCase):
    def test_user_registration(self):
        User = get_user_model()
        # Ensure 'user-register' matches the name in users.urls
        # In users/urls.py, it's 'user-register' for path 'auth/register/'
        url = reverse('users:user-register') # Using namespace
        data = {
            'account_number': 'newuser123', 
            'first_name': 'New', 
            'last_name': 'User', 
            'password': 'newpassword123',
            # is_customer_role is True by default in serializer/model if not provided
        }
        response = self.client.post(url, data, format='json')
        
        # Debugging: print response content if status is not 201
        if response.status_code != status.HTTP_201_CREATED:
            print("Registration failed. Response data:", response.data)
            
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(account_number='newuser123').exists())

    def test_user_login(self):
        User = get_user_model()
        # User created for login test
        User.objects.create_user(
            account_number='loginuser', 
            first_name='Login', 
            last_name='User', 
            password='loginpass'
        )
        
        # Ensure 'token_obtain_pair' matches the name in users.urls
        url = reverse('users:token_obtain_pair') # Using namespace
        data = {'account_number': 'loginuser', 'password': 'loginpass'}
        response = self.client.post(url, data, format='json')

        # Debugging: print response content if status is not 200
        if response.status_code != status.HTTP_200_OK:
            print("Login failed. Response data:", response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)
