from django.contrib.auth import get_user_model
from test_plus.test import TestCase

from friendrequest.models import FriendRequest

from adoorback.utils.seed import set_seed, fill_data

User = get_user_model()
N = 10


class FriendRequestTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_friend_request_count(self):
        user_count = User.objects.all().count()
        self.assertEqual(FriendRequest.objects.all().count(), user_count)

    def test_friend_request_str(self):
        friend_request = FriendRequest.objects.all().last()
        self.assertEqual(friend_request.__str__(),
                         f'{friend_request.actor} sent friend request to {friend_request.recipient}')
        self.assertEqual(friend_request.type, 'FriendRequest')

    def test_sent_friend_request_count(self):
        fill_data()
        user = User.objects.get(id=2)
        self.assertGreater(user.sent_friend_request_set.all().count(), 0)

    def test_received_friend_request_count(self):
        fill_data()
        user = User.objects.get(id=2)
        self.assertGreater(user.received_friend_request_set.all().count(), 0)

    def test_on_delete_actor_cascade(self):
        user = User.objects.get(id=2)
        other = User.objects.get(id=3)
        FriendRequest.objects.create(actor=user, recipient=other)
        self.assertGreater(user.sent_friend_request_set.all().count(), 0)

        user.delete()
        self.assertEqual(User.objects.all().filter(id=2).count(), 0)
        self.assertEqual(FriendRequest.objects.all().filter(
            actor_id=2).count(), 0)

    def test_on_delete_recipient_cascade(self):
        user = User.objects.get(id=2)
        other = User.objects.get(id=3)
        FriendRequest.objects.create(actor=user, recipient=other)
        self.assertGreater(user.sent_friend_request_set.all().count(), 0)

        other.delete()
        self.assertEqual(User.objects.all().filter(id=3).count(), 0)
        self.assertEqual(FriendRequest.objects.all().filter(
            other_id=3).count(), 0)
