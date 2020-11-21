from django.contrib.auth import get_user_model
from django.test import Client
from rest_framework.utils import json
from rest_framework.test import APIClient
from test_plus.test import TestCase

from adoorback.utils.seed import set_seed

from django.urls import reverse

N = 10


class UserTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_user_count(self):
        User = get_user_model()
        self.assertEqual(User.objects.all().count(), 3)

    def test_str(self):
        User = get_user_model()
        user = User.objects.all().last()
        self.assertEqual(user.type, 'User')


class APITestCase(TestCase):
    client_class = APIClient


class UserAPITestCase(APITestCase):

    def setUp(self):
        set_seed(N)

    def test_friend_list(self):
        current_user = self.make_user(username='current_user')

        with self.login(username=current_user.username, password='password'):
            User = get_user_model()
            response = self.get(
                reverse('user-friend-list', args=[current_user.id-1]))
            self.assertEqual(response.status_code, 200)

    def test_search(self):
        current_user = self.make_user(username='current_user')

        with self.login(username=current_user.username, password='password'):
            response = self.get('user-search', data={'query': 'adoor'})
            self.assertEqual(response.status_code, 200)
            self.assertGreaterEqual(response.data['count'], 1)


class AuthAPITestCase(APITestCase):

    def test_csrf(self):
        client = Client(enforce_csrf_checks=True)

        self.make_user(username="username", password="password")

        signup_data = {"username": "test_username",
                       "password": "test_password", "email": "test@email.com"}
        response = client.post('/api/user/signup/',
                               json.dumps(signup_data),
                               content_type='application/json')
        # should return 403 error w/o csrf token
        self.assertEqual(response.status_code, 403)

        login_data = {"username": "username", "password": "password"}
        response = client.post('/api/user/token/',
                               json.dumps(login_data),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)

        csrftoken = response.cookies['csrftoken'].value
        signup_data2 = {"username": "test_username2",
                        "password": "test_password", "email": "test2@email.com"}
        response = client.post('/api/user/signup/',
                               json.dumps(signup_data2),
                               HTTP_X_CSRFTOKEN=csrftoken,
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_user_login(self):
        client = APIClient()

        User = get_user_model()
        User.objects.create_user(
            username="test_username", email="test@email.com", password="test_password")

        response = client.get('/api/user/login/')
        self.assertEqual(response.status_code, 405)     # Request not allowed

        response = client.post('/api/user/login/', {},
                               content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.post('/api/user/login/',
                               json.dumps({'username': 'walalala',
                                           'password': 'bahaahaha'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = client.get('/api/user/')
        self.assertEqual(response.status_code, 403)

        login_data = {"username": "test_username", "password": "test_password"}
        response = client.post(
            '/api/user/login/', json.dumps(login_data), content_type='application/json')
        self.assertEqual(response.status_code, 204)

        response = client.get('/api/user/')
        self.assertEqual(response.status_code, 200)

    def test_signup(self):
        client = Client()

        response = client.post('/api/user/signup/', {},
                               content_type='application/json')
        self.assertEqual(response.status_code, 400)

        signup_data = {
            'username': 'test_username',
            'password': 'test_password',
            'email': 'test@email.com',
        }

        response = client.get('/api/user/signup/')
        self.assertEqual(response.status_code, 405)     # Request not allowed

        response = client.post('/api/user/signup/',
                               signup_data, content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # duplicate user
        response = client.post('/api/user/signup/',
                               signup_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_user_list(self):
        current_user = self.make_user(username='current_user')
        admin_user = self.make_user(username='admin_user')
        admin_user.is_superuser = True
        admin_user.save()

        with self.login(username=current_user.username, password='password'):
            response = self.get('user-list')
            self.assertEqual(response.data['count'], 1)

        with self.login(username=admin_user.username, password='password'):
            response = self.get('user-list')
            User = get_user_model()
            n = User.objects.all().count()
            self.assertEqual(response.data['count'], n)

    def test_current_user(self):
        client = Client()

        response = client.get('/api/user/me/')
        self.assertEqual(response.status_code, 401)

        response = client.post('/api/user/me/', {},
                               content_type='application/json')
        self.assertEqual(response.status_code, 405)

        self.make_user(username="test_user", password="test_pw")
        with self.login(username="test_user", password="test_pw"):
            response = self.get('current-user')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()['username'], "test_user")
