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

    def test_friendship_count(self):
        user_count = User.objects.all().count()
        self.assertEqual(Friendship.objects.all().count(), user_count)

    def test_friendship_str(self):
        friendship = Friendship.objects.all().last()
        self.assertEqual(friendship.__str__(),
                         f'{friendship.user} is friends with {friendship.friend}')
        self.assertEqual(friendship.type, 'Friendship')

    def test_on_delete_user_cascade(self):
        fill_data()
        user = User.objects.get(id=2)
        self.assertGreater(user.friend_set.all().count(), 0)

        user.delete()
        self.assertEqual(User.objects.all().filter(id=2).count(), 0)
        self.assertEqual(Friendship.objects.all().filter(
            user_id=2).count(), 0)

    def test_on_delete_friend_cascade(self):
        fill_data()
        user = User.objects.get(id=2)
        friend = user.friend_set.all().first()
        self.assertGreater(user.friend_set.all().count(), 0)

        friend.delete()
        self.assertEqual(user.friend_set.all().count(), 0)
