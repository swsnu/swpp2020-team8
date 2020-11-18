from django.contrib.auth import get_user_model
from test_plus.test import TestCase
from rest_framework.test import APIClient

from adoorback.utils.seed import set_seed

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

    def test_search(self):
        current_user = self.make_user(username='current_user')

        with self.login(username=current_user.username, password='password'):
            response = self.get('user-search', data={'query': 'adoor'})
            self.assertEqual(response.status_code, 200)
            self.assertGreaterEqual(response.data['count'], 1)
