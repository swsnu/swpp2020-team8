from django.contrib.auth import get_user_model
from django.test import Client
from rest_framework.utils import json
from rest_framework.test import APIClient
from test_plus.test import TestCase

from adoorback.utils.seed import set_seed

from account.models import FriendRequest
from notification.models import Notification

User = get_user_model()
N = 10


class UserTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_user_count(self):
        self.assertEqual(User.objects.count(), 3)

    def test_str(self):
        user = User.objects.last()
        self.assertEqual(user.type, 'User')


class UserFriendshipCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_on_friend_request_create_friendship(self):
        user = User.objects.first()
        self.assertEqual(user.friends.count(), 1)

    def test_on_delete_user_cascade(self):
        user = User.objects.first()
        user_id = user.id
        friend = user.friends.first()
        user.delete()
        self.assertEqual(User.objects.filter(id=user_id).count(), 0)
        self.assertEqual(friend.friends.count(), 0)


class FriendRequestTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_friend_request_count(self):
        self.assertEqual(FriendRequest.objects.count(), 3)

    def test_friend_request_str(self):
        friendrequest = FriendRequest.objects.first()
        self.assertEqual(friendrequest.type, 'FriendRequest')
        self.assertEqual(friendrequest.__str__(),
                         f'{friendrequest.requester} sent to {friendrequest.requestee} ({friendrequest.accepted})')

    def test_on_delete_requester_cascade(self):
        user = FriendRequest.objects.first().requester
        sent_friend_requests = user.sent_friend_requests.all()
        self.assertEqual(sent_friend_requests.count(), 2)

        user.delete()
        self.assertEqual(User.objects.filter(id=user.id).count(), 0)
        self.assertEqual(FriendRequest.objects.filter(requester_id=user.id).count(), 0)
        self.assertEqual(FriendRequest.objects.filter(requestee_id=user.id).count(), 0)

    def test_on_delete_requestee_cascade(self):
        user = FriendRequest.objects.first().requestee
        received_friend_requests = user.received_friend_requests.all()
        self.assertEqual(received_friend_requests.count(), 1)

        user.delete()
        self.assertEqual(User.objects.filter(id=user.id).count(), 0)
        self.assertEqual(FriendRequest.objects.filter(requester_id=user.id).count(), 0)
        self.assertEqual(FriendRequest.objects.filter(requestee_id=user.id).count(), 0)

    def test_on_delete_responder_cascade(self):
        user = FriendRequest.objects.first().requestee
        received_friend_requests = user.received_friend_requests.all()
        self.assertGreater(received_friend_requests.count(), 0)

        user.delete()
        self.assertEqual(User.objects.filter(id=user.id).count(), 0)
        self.assertEqual(FriendRequest.objects.filter(requester_id=user.id).count(), 0)
        self.assertEqual(FriendRequest.objects.filter(requestee_id=user.id).count(), 0)


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

    def test_friend_list(self):
        current_user = self.make_user(username='current_user')

        with self.login(username=current_user.username, password='password'):
            response = self.get('current-user-friends')
            self.assertEqual(response.status_code, 200)

    def test_user_friend_detail(self):
        current_user = self.make_user(username='current_user')
        friend_user = self.make_user(username='friend_user')
        current_user.friends.add(friend_user)

        with self.login(username=current_user.username, password='password'):
            response = self.delete(
                self.reverse('user-friend-destroy', pk=friend_user.id))
            self.assertEqual(response.status_code, 204)


class AuthAPITestCase(APITestCase):

    def test_csrf(self):
        client = Client(enforce_csrf_checks=True)

        self.make_user(username="username", password="password")

        signup_data = {"username": "test_username",
                       "password": "test_password", "email": "test@email.com"}
        response = client.post('/api/user/signup/',
                               json.dumps(signup_data),
                               content_type='application/json')
        # should return 403 error w/o csrf token
        self.assertEqual(response.status_code, 403)

        login_data = {"username": "username", "password": "password"}
        response = client.post('/api/user/token/',
                               json.dumps(login_data),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)

        csrftoken = response.cookies['csrftoken'].value
        signup_data2 = {"username": "test_username2",
                        "password": "test_password", "email": "test2@email.com"}
        response = client.post('/api/user/signup/',
                               json.dumps(signup_data2),
                               HTTP_X_CSRFTOKEN=csrftoken,
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_user_login(self):
        client = APIClient()
        User.objects.create_user(
            username="test_username", email="test@email.com", password="test_password")

        response = client.get('/api/user/login/')
        self.assertEqual(response.status_code, 405)     # Request not allowed

        response = client.post('/api/user/login/', {},
                               content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.post('/api/user/login/',
                               json.dumps({'username': 'walalala',
                                           'password': 'bahaahaha'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = client.get('/api/user/')
        self.assertEqual(response.status_code, 403)

        login_data = {"username": "test_username", "password": "test_password"}
        response = client.post(
            '/api/user/login/', json.dumps(login_data), content_type='application/json')
        self.assertEqual(response.status_code, 204)

        response = client.get('/api/user/')
        self.assertEqual(response.status_code, 200)

    def test_signup(self):
        client = Client()

        response = client.post('/api/user/signup/', {},
                               content_type='application/json')
        self.assertEqual(response.status_code, 400)

        signup_data = {
            'username': 'test_username',
            'password': 'test_password',
            'email': 'test@email.com',
        }

        response = client.get('/api/user/signup/')
        self.assertEqual(response.status_code, 405)     # Request not allowed

        response = client.post('/api/user/signup/',
                               signup_data, content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # duplicate user
        response = client.post('/api/user/signup/',
                               signup_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # invalid json
        invalid_signup_data = {
            "username": "test_username",
            "password": "abc",
            "email": "wa@"
        }
        response = client.post(
            '/api/user/signup/', invalid_signup_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_user_list(self):
        current_user = self.make_user(username='current_user')
        admin_user = self.make_user(username='admin_user')
        admin_user.is_superuser = True
        admin_user.save()

        with self.login(username=current_user.username, password='password'):
            response = self.get('user-list')
            self.assertEqual(response.data['count'], 1)

        with self.login(username=admin_user.username, password='password'):
            response = self.get('user-list')

            n = User.objects.count()
            self.assertEqual(response.data['count'], n)

    def test_current_user(self):
        self.make_user(username="test_user", password="test_pw")
        with self.login(username="test_user", password="test_pw"):
            response = self.get('current-user')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()['username'], "test_user")

            data = {"question_history": '[1, 2, 3]'}
            response = self.patch('current-user', data=data)
            self.assertEqual(response.status_code, 200)

            data = {"question_history": '[1, 2, 3]'}
            response = self.post('current-user', data=data)
            self.assertEqual(response.status_code, 405)


class FriendRequestAPITestCase(APITestCase):

    def setUp(self):
        set_seed(N)

    def test_friend_request_list(self):
        current_user = self.make_user(username='current_user')
        friend_user_1 = self.make_user(username='friend_user_1')
        friend_user_2 = self.make_user(username='friend_user_2')

        prev_noti_count = Notification.objects.count()
        FriendRequest.objects.create(
            requester=current_user, requestee=friend_user_1)
        FriendRequest.objects.create(
            requester=current_user, requestee=friend_user_2)
        FriendRequest.objects.create(
            requester=friend_user_1, requestee=friend_user_2)
        curr_noti_count = Notification.objects.count()
        self.assertEqual(curr_noti_count, prev_noti_count + 3)

        with self.login(username=current_user.username, password='password'):
            response = self.get('user-friend-request-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], 0)

        with self.login(username=friend_user_1.username, password='password'):
            response = self.get('user-friend-request-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], 1)

        with self.login(username=friend_user_2.username, password='password'):
            response = self.get('user-friend-request-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], 2)

    def test_friend_request_detail(self):
        current_user = self.make_user(username='current_user')
        friend_user_1 = self.make_user(username='friend_user_1')
        friend_user_2 = self.make_user(username='friend_user_2')

        # id = 1
        FriendRequest.objects.create(
            requester=current_user, requestee=friend_user_1)
        # id = 2
        FriendRequest.objects.create(
            requester=current_user, requestee=friend_user_2)
        # id = 3
        FriendRequest.objects.create(
            requester=friend_user_1, requestee=friend_user_2)

        # POST FriendRequest (friend_user_2 -> friend_user_1)
        with self.login(username=friend_user_2.username, password='password'):
            data = {"requester_id": friend_user_2.id, "requestee_id": friend_user_1.id}
            response = self.post('user-friend-request-list', data=data)
            self.assertEqual(response.status_code, 201)

        # PATCH (accept) FriendRequest (friend_user_1 -> friend_user_2)
        with self.login(username=friend_user_1.username, password='password'):
            data = {"accepted": True}
            response = self.patch(self.reverse(
                'user-friend-request-update', pk=friend_user_2.id), data=data)
            self.assertEqual(response.status_code, 200)

        # PATCH (reject) FriendRequest (friend_user_1 -> friend_user_2)
        with self.login(username=friend_user_1.username, password='password'):
            data = {"accepted": False}
            response = self.patch(self.reverse(
                'user-friend-request-update', pk=friend_user_2.id), data=data)
            self.assertEqual(response.status_code, 200)

        # DELETE FriendRequest (friend_user_2 -> friend_user_1)
        with self.login(username=friend_user_2.username, password='password'):
            response = self.delete(self.reverse(
                'user-friend-request-destroy', pk=friend_user_1.id))
            self.assertEqual(response.status_code, 204)
