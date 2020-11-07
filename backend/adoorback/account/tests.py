from django.test import TestCase
from adoorback.utils.seed import set_seed
from django.contrib.auth import get_user_model


N = 10


class ProfileTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_profile_count(self):
        User = get_user_model()
        self.assertEqual(User.objects.all().count(), 3)
