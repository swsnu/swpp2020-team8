from django.contrib.auth import get_user_model
from test_plus.test import TestCase

from friendrequest.models import FriendRequest

from adoorback.utils.seed import set_seed, fill_data

User = get_user_model()
N = 10


class FriendRequestTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_friendship_count(self):
        user_count = User.objects.all().count()
        self.assertEqual(FriendRequest.objects.all().count(), user_count)

    def test_friendship_str(self):
        friend_request = FriendRequest.objects.all().last()
        self.assertEqual(friend_request.__str__(),
                         f'{friend_request.actor} is friends with {friend_request.recipient}')
        self.assertEqual(friend_request.type, 'FriendRequest')
