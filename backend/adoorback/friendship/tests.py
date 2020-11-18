from django.contrib.auth import get_user_model
from test_plus.test import TestCase
from rest_framework.test import APIClient

from friendship.models import Friendship

from adoorback.utils.seed import set_seed, fill_data

User = get_user_model()
N = 10


class FriendshipTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_friend_count(self):
        self.assertEqual(Friendship.objects.all().count(), N*5)


class APITestCase(TestCase):
    client_class = APIClient


class FriendshipAPITestCase(APITestCase):

    def setUp(self):
        set_seed(N)

    def test_friend_list(self):
        current_user = self.make_user(username='current_user')

        with self.login(username=current_user.username, password='password'):
            response = self.get('friend-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], N*5)
