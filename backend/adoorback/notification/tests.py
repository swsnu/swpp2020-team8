from django.contrib.auth import get_user_model
from test_plus.test import TestCase
from rest_framework.test import APIClient

from notification.models import Notification

from adoorback.utils.seed import set_seed, fill_data
from adoorback.utils.content_types import get_content_type

User = get_user_model()
N = 10

class NotificationTestCase(TestCase):
    def setUp(self):
        set_seed(N)
    
    def test_noti_count(self):
        # should be changed after adding friend/response-request noti
        self.assertEqual(Notification.object.all().count(), N * 2)

    def test_noti_str(self):
        noti = Notification.objects.all().last()
        self.assertEqual(noti.__str__(), noti.message)

        comment_noti = Notification.objects.filter(target_type=get_content_type('Comment')).last()
        self.assertEqual(comment_noti.target.type, 'Comment')

        like_noti = Notification.objects.filter(target_type=get_content_type('Like')).last()
        self.assertEqual(like_noti.target.type, 'Like')

    # test on delete actor user 
    def test_on_delete_actor_cascade(self):
        fill_data()
        user = User.objects.get(id=2)
        sent_notis = user.sent_noti_set.all()
        noti_acted = Notification.objects.all().filter(actor_id=2)
        self.assertEqual(sent_notis.count(), noti_acted.count())

        user.delete()
        self.assertEqual(User.objects.all().filter(id=2).count(), 0)
        self.assertEqual(Notification.objects.all().filter(actor_id=2).count(), 0)

    # test on delete recipient user
    def test_on_delete_recipient_cascade(self):
        fill_data()
        user = User.objects.get(id=1)
        received_notis = user.received_noti_set.all()
        noti_received = Notification.objects.all().filter(recipient_id=1)
        self.assertEqual(received_notis.count(), noti_received.count())

        user.delete()
        self.assertEqual(User.objects.all().filter(id=1).count(), 0)
        self.assertEqual(Notification.objects.all().filter(recipient_id=1).count(), 0)


    # test on delete target 
    def test_on_delete_target_cascade(self):
        # target = comment
        noti = Notification.objects.all().filter(target_type=get_content_type("Comment")).last()
        target = noti.target
        target_id = target.id
        target.delete()
        self.assertEqual(Notification.objects.all().filter(
            target_type=get_content_type("Comment"), target_id=target_id).count(), 0)

        # target = like
        noti = Notification.objects.all().filter(target_type=get_content_type("Like")).last()
        target = noti.target
        target_id = target.id
        target.delete()
        self.assertEqual(Notification.objects.all().filter(
            target_type=get_content_type("Like"), target_id=target_id).count(), 0)

    # test on delete origin
    def test_on_delete_origin_cascade(self):
        # origin = article
        noti = Notification.objects.all().filter(origin_type=get_content_type("Article")).last()
        origin = noti.origin
        origin_id = origin.id
        origin.delete()
        self.assertEqual(Notification.objects.all().filter(
            origin_type=get_content_type("Article"), origin_id=origin_id).count(), 0)
        # origin = response
        noti = Notification.objects.all().filter(origin_type=get_content_type("Response")).last()
        origin = noti.origin
        origin_id = origin.id
        origin.delete()
        self.assertEqual(Notification.objects.all().filter(
            origin_type=get_content_type("Response"), origin_id=origin_id).count(), 0)
        # origin = question
        noti = Notification.objects.all().filter(origin_type=get_content_type("Question")).last()
        origin = noti.origin
        origin_id = origin.id
        origin.delete()
        self.assertEqual(Notification.objects.all().filter(
            origin_type=get_content_type("Question"), origin_id=origin_id).count(), 0)
        # origin = comment
        noti = Notification.objects.all().filter(origin_type=get_content_type("Comment")).last()
        origin = noti.origin
        origin_id = origin.id
        origin.delete()
        self.assertEqual(Notification.objects.all().filter(
            origin_type=get_content_type("Comment"),origin_id=origin_id).count(), 0)
        # origin = like
        noti = Notification.objects.all().filter(origin_type=get_content_type("Like")).last()
        origin = noti.origin
        origin_id = origin.id
        origin.delete()
        self.assertEqual(Notification.objects.all().filter(
            origin_type=get_content_type("Like"), origin_id=origin_id).count(), 0)
