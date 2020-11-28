from django.contrib.auth import get_user_model
from test_plus.test import TestCase
from rest_framework.test import APIClient

from comment.models import Comment
from like.models import Like
from notification.models import Notification

from adoorback.utils.seed import set_seed, fill_data
from adoorback.utils.content_types import get_content_type

User = get_user_model()
N = 10


class NotificationTestCase(TestCase):

    def setUp(self):
        set_seed(N)

    def test_noti_count(self):
        self.assertGreater(Notification.objects.all().count(), N * 2)
        comment_noti_count = Notification.objects.filter(
            target_type=get_content_type('Comment')).count()
        self.assertGreater(comment_noti_count, N)
        like_noti_count = Notification.objects.filter(target_type=get_content_type('Like')).count()
        self.assertGreater(like_noti_count, N)
        # should be created automatically

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
        user = User.objects.all().last()
        user_id = user.id
        sent_notis = user.sent_noti_set.all()
        noti_acted = Notification.objects.all().filter(actor_id=user_id)
        self.assertEqual(sent_notis.count(), noti_acted.count())

        user.delete()
        self.assertEqual(User.objects.all().filter(id=user_id).count(), 0)
        self.assertEqual(Notification.objects.all().filter(actor_id=user_id).count(), 0)

    # test on delete recipient user
    def test_on_delete_recipient_cascade(self):
        fill_data()
        user = User.objects.all().first()
        user_id = user.id
        received_notis = user.received_noti_set.all()
        noti_received = Notification.objects.all().filter(recipient_id=user_id)
        self.assertEqual(received_notis.count(), noti_received.count())

        user.delete()
        self.assertEqual(User.objects.all().filter(id=user_id).count(), 0)
        self.assertEqual(Notification.objects.all().filter(recipient_id=user_id).count(), 0)

    # test on delete target
    def test_on_delete_target_cascade(self):
        # target = comment
        fill_data()
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
        fill_data()
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


class APITestCase(TestCase):
    client_class = APIClient


class NotificationAPITestCase(APITestCase):

    def setUp(self):
        set_seed(N)

    def test_noti_list(self):
        current_user = self.make_user(username='current_user')
        received_notis_count = Notification.objects.filter(recipient=current_user).count()
        with self.login(username=current_user.username, password='password'):
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], received_notis_count)

    def test_noti_author_permission(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        like = Like.objects.all().first()
        target = like
        message = 'test noti'
        Notification.objects.create(actor = current_user, recipient = current_user, message = message,
            origin = target, target= target)
        Notification.objects.create(actor = current_user, recipient = spy_user, message = message,
            origin = target, target= target)

        # not authenticated
        response = self.get('notification-list')
        self.assertEqual(response.status_code, 401)

        with self.login(username=current_user.username, password='password'):
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            noti = response.data['results'][0]
            self.assertGreater(len(noti['recipient_detail']), 1)
            self.assertGreater(len(noti['actor_detail']), 1)

        with self.login(username=spy_user.username, password='password'):
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            noti = response.data['results'][0]
            self.assertGreater(len(noti['recipient_detail']), 1)
            self.assertEqual(len(noti['actor_detail']), 1)

        with self.login(username=current_user.username, password='password'):
            response = self.put('notification-list')
            self.assertEqual(response.status_code, 200)


    def test_noti_update(self):
        current_user = self.make_user(username='receiver')
        # create noti object that current user receives
        comment = Comment.objects.all().first()
        actor = comment.author
        origin = comment.target
        recipient = current_user
        target = comment
        message = f'{actor} commented on your {origin.type}'
        Notification.objects.create(actor=actor, recipient=recipient, message=message,
            origin=origin, target= target, is_read = False, is_visible = True)

        received_noti = Notification.objects.filter(recipient=current_user).last()
        data = {"is_read": True }
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('notification-update',
                                               pk=received_noti.id), data=data)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['is_read'], True)
        # test restriction
        spy_user = self.make_user(username='spy_user')

        with self.login(username=spy_user.username, password='password'):
            response = self.patch(self.reverse('notification-update',
                                               pk=received_noti.id), data=data)
            self.assertEqual(response.status_code, 403)
