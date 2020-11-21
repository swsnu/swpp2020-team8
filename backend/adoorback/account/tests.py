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
            print(User.objects.all().count())
            print(current_user.id)
            response = self.get(
                reverse('user-friend-list', args=[current_user.id-1]))
            self.assertEqual(response.status_code, 200)
