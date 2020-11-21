from django.contrib.auth import get_user_model
from test_plus.test import TestCase
from rest_framework.test import APIClient

from notification.models import Notification

from adoorback.utils.seed import set_seed, fill_data
from adoorback.utils.content_types import get_content_type

User = get_user_model()
N = 10
