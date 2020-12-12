from django.contrib.auth import get_user_model
from test_plus.test import TestCase
from rest_framework.test import APIClient

from comment.models import Comment
from like.models import Like
from notification.models import Notification

from adoorback.utils.seed import set_seed, fill_data
from adoorback.content_types import get_comment_type, get_like_type, \
    get_article_type, get_question_type, get_response_type, get_response_request_type

User = get_user_model()
N = 10


class NotificationTestCase(TestCase):

    def setUp(self):
        set_seed(N)

    def test_noti_count(self):
        self.assertGreater(Notification.objects.count(), N * 2)
        comment_noti_count = Notification.objects.filter(
            target_type=get_comment_type()).count()
        self.assertGreater(comment_noti_count, N)
        like_noti_count = Notification.objects.filter(target_type=get_like_type()).count()
        self.assertGreater(like_noti_count, N)
        # should be created automatically

    def test_noti_str(self):
        noti = Notification.objects.last()
        self.assertEqual(noti.__str__(), noti.message)

        comment_noti = Notification.objects.filter(target_type=get_comment_type()).last()
        self.assertEqual(comment_noti.target.type, 'Comment')

        like_noti = Notification.objects.filter(target_type=get_like_type()).last()
        self.assertEqual(like_noti.target.type, 'Like')


class DeleteActorNotificationTestCase(TestCase):

    def setUp(self):
        set_seed(N)

    # test on delete actor user
    def test_on_delete_actor_cascade(self):
        user = User.objects.last()
        user_id = user.id
        sent_notis = user.sent_noti_set.visible_only()
        noti_acted = Notification.objects.visible_only().filter(actor_id=user_id)
        self.assertEqual(sent_notis.count(), noti_acted.count())
        self.assertGreater(sent_notis.count(), 0)
        self.assertGreater(noti_acted.count(), 0)

        user.delete()
        self.assertEqual(User.objects.filter(id=user_id).count(), 0)
        self.assertEqual(Notification.objects.visible_only().filter(actor_id=user_id).count(), 0)


class DeleteRecipientNotificationTestCase(TestCase):

    def setUp(self):
        set_seed(N)

    # test on delete recipient user
    def test_on_delete_recipient_cascade(self):
        fill_data()
        user = User.objects.first()
        user_id = user.id
        received_notis = user.received_noti_set.visible_only()
        noti_received = Notification.objects.visible_only().filter(user_id=user_id)
        self.assertEqual(received_notis.count(), noti_received.count())
        self.assertGreater(received_notis.count(), 0)
        self.assertGreater(noti_received.count(), 0)

        user.delete()
        self.assertEqual(User.objects.filter(id=user_id).count(), 0)
        self.assertEqual(Notification.objects.visible_only().filter(user_id=user_id).count(), 0)


class DeleteObjectNotificationTestCase(TestCase):

    def setUp(self):
        set_seed(N)

    # test on delete target
    def test_on_delete_target_cascade(self):
        # target = comment
        noti = Notification.objects.visible_only().filter(target_type=get_comment_type()).last()
        target = noti.target
        target_id = target.id
        target.delete()
        self.assertEqual(Notification.objects.visible_only().filter(
            target_type=get_comment_type(), target_id=target_id).count(), 0)

        # target = like
        noti = Notification.objects.visible_only().filter(target_type=get_like_type()).last()
        target = noti.target
        target_id = target.id
        target.delete()
        self.assertEqual(Notification.objects.visible_only().filter(
            target_type=get_like_type(), target_id=target_id).count(), 0)

        # target = response request
        noti = Notification.objects.visible_only().filter(target_type=get_response_request_type()).last()
        target = noti.target
        target_id = target.id
        target.delete()
        self.assertEqual(Notification.objects.visible_only().filter(
            target_type=get_response_request_type(), target_id=target_id).count(), 0)


class DeleteFeedNotificationTestCase(TestCase):

    def setUp(self):
        set_seed(N)

    # test on delete origin
    def test_on_delete_origin_cascade(self):
        # origin = comment
        noti = Notification.objects.visible_only().filter(origin_type=get_comment_type()).last()
        origin = noti.origin
        origin_id = origin.id
        origin.delete()
        self.assertEqual(Notification.objects.visible_only().filter(
            origin_type=get_comment_type(), origin_id=origin_id).count(), 0)

        # origin = article
        fill_data()
        noti = Notification.objects.visible_only().filter(origin_type=get_article_type()).last()
        origin = noti.origin
        origin_id = origin.id
        origin.delete()
        self.assertEqual(Notification.objects.visible_only().filter(
            origin_type=get_article_type(), origin_id=origin_id).count(), 0)
        self.assertGreater(Notification.objects.visible_only().filter(
            redirect_url__icontains=f'/articles/{origin_id}').count(), 0)  # 노티 자체가 안 보이지는 않아야 함

        # origin = response
        noti = Notification.objects.visible_only().filter(origin_type=get_response_type()).last()
        origin = noti.origin
        origin_id = origin.id
        origin.delete()
        self.assertEqual(Notification.objects.visible_only().filter(
            origin_type=get_response_type(), origin_id=origin_id).count(), 0)
        self.assertGreater(Notification.objects.visible_only().filter(
            redirect_url__icontains=f'/responses/{origin_id}').count(), 0)  # 노티 자체가 안 보이지는 않아야 함

        # origin = question
        noti = Notification.objects.visible_only().filter(target_type=get_response_request_type(),
                                                          origin_type=get_question_type()).last()
        origin = noti.origin
        origin_id = origin.id
        origin.delete()
        self.assertEqual(Notification.objects.visible_only().filter(
            origin_type=get_question_type(), origin_id=origin_id).count(), 0)  # origin type은 바뀌어야 함
        self.assertGreater(Notification.objects.visible_only().filter(
            redirect_url__icontains=f'/questions/{origin_id}').count(), 0)  # 노티 자체가 안 보이지는 않아야 함


class APITestCase(TestCase):
    client_class = APIClient


class NotificationAPITestCase(APITestCase):

    def setUp(self):
        set_seed(N)

    def test_noti_list(self):
        current_user = self.make_user(username='current_user')
        received_notis_count = Notification.objects.filter(user=current_user).count()
        with self.login(username=current_user.username, password='password'):
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], received_notis_count)

    def test_noti_author_profile(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        like = Like.objects.first()
        target = like
        message = 'test noti'
        Notification.objects.create(actor=current_user, user=current_user, message=message,
                                    origin=target, target=target)
        Notification.objects.create(actor=current_user, user=spy_user, message=message,
                                    origin=target, target=target)

        # not authenticated
        response = self.get('notification-list')
        self.assertEqual(response.status_code, 403)

        with self.login(username=current_user.username, password='password'):
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            noti = response.data['results'][0]
            self.assertGreater(len(noti['actor_detail']), 1)

        with self.login(username=spy_user.username, password='password'):
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            noti = response.data['results'][0]
            self.assertEqual(len(noti['actor_detail']), 1)

    def test_friendship_noti(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        # Friend Request Noti Author Profile should NOT be anonymized
        with self.login(username=current_user.username, password='password'):
            data = {"requester_id": current_user.id, "requestee_id": spy_user.id}
            response = self.post('user-friend-request-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)

        # friend request should not be visible after accept
        with self.login(username=spy_user.username, password='password'):
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            noti = response.data['results'][0]
            self.assertGreater(len(noti['actor_detail']), 1)  # not anonymized
            self.assertEqual(noti['question_content'], None)  # should be null

            # PATCH (accept) FriendRequest (spy_user -> current_user)
            data = {"accepted": True}
            response = self.patch(self.reverse(
                'user-friend-request-update', pk=current_user.id), data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 200)

            response = self.get('notification-list')
            self.assertEqual(response.data['count'], 1)  # friend request noti is not visible
            self.assertEqual(response.data['results'][0]['message'], 'current_user님과 친구가 되었습니다.')

    def test_noti_type_boolean(self):
        current_user = self.make_user(username='current_user')

        Notification.objects.create(user=current_user, actor=current_user, target=None, origin=None)
        with self.login(username='current_user', password='password'):
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            noti = response.data['results'][0]
            self.assertEqual(noti['is_response_request'], False)
            self.assertEqual(noti['is_friend_request'], False)

    def test_response_request_noti(self):
        # Response Request/Response noti should include question content
        current_user = self.make_user(username='current_user')
        friend_user = self.make_user(username='friend_user')
        current_user.friends.add(friend_user)

        data = {"requester_id": current_user.id, "requestee_id": friend_user.id, "question_id": 1}
        with self.login(username=current_user.username, password='password'):
            response = self.post('response-request-create', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)

        with self.login(username=friend_user.username, password='password'):
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            noti_1 = response.data['results'][0]
            self.assertNotEqual(noti_1['question_content'], None)  # should not be empty

            # respond to response request
            data = {"content": "test content", "question_id": 1, "share_anonymously": True}
            response = self.post('response-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)

        with self.login(username=current_user.username, password='password'):
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            noti_2 = response.data['results'][0]
            self.assertNotEqual(noti_2['question_content'], None)  # should not be empty

            self.assertEqual(noti_1['question_content'], noti_2['question_content'])
            self.assertLessEqual(len(noti_1['question_content']), 33)

        # POST - not allowed
        with self.login(username=current_user.username, password='password'):
            response = self.post('notification-list')
            self.assertEqual(response.status_code, 405)

    def test_noti_update(self):
        current_user = self.make_user(username='receiver')
        # create noti object that current user receives
        comment = Comment.objects.first()
        actor = comment.author
        origin = comment.target
        target = comment
        message = f'{actor} commented on your {origin.type}'

        for _ in range(5):
            Notification.objects.create(actor=actor, user=current_user, message=message,
                                        origin=origin, target=target, is_read=False, is_visible=True)

        # update single notification - wrong body
        received_noti = Notification.objects.filter(user=current_user).first()
        data = {"has_read": True}
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('notification-update',
                                               pk=received_noti.id), data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 400)

        # update single notification
        received_noti = Notification.objects.filter(user=current_user).first()
        data = {"is_read": True}
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('notification-update',
                                               pk=received_noti.id), data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['is_read'], True)

        # update single notification - wrong body
        received_noti = Notification.objects.filter(user=current_user).first()
        data = {"is_read": False}  # cannot un-read notification
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('notification-update',
                                               pk=received_noti.id), data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 400)

            # method not allowed
            response = self.get(self.reverse('notification-update', pk=received_noti.id))
            self.assertEqual(response.status_code, 405)

        # test restriction - update single notification
        not_allowed_noti = Notification.objects.exclude(user=current_user).first()
        data = {"is_read": True}
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('notification-update',
                                               pk=not_allowed_noti.id), data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 403)

        # update all notifications
        with self.login(username=current_user.username, password='password'):
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['results'][0]['is_read'], True)  # first noti should be read

            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['results'][1]['is_read'], False)  # second noti should not be

            response = self.patch('notification-list')  # update
            self.assertEqual(response.status_code, 200)
            response = self.get('notification-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['results'][1]['is_read'], True)  # all notis should be read

    def test_noti_extension_view(self):

        user = self.make_user(username='current_user')
        Notification.objects.create(user=user, actor=user, redirect_url="url", message="message")

        response = self.get('notification-id', data={'username': 'current_user'})
        self.assertEqual(response.status_code, 200)
        self.assertGreater(response.json()['id'], 0)
        self.assertEqual(response.json()['num_unread'], 1)

        with self.login(username='current_user', password='password'):
            response = self.patch('notification-list')  # update
            self.assertEqual(response.status_code, 200)

        response = self.get('notification-id', data={'username': 'current_user'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['id'], 0)
        self.assertEqual(response.json()['num_unread'], 0)
