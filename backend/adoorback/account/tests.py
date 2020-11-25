from django.contrib.auth import get_user_model
from django.test import Client
from django.urls import reverse
from rest_framework.utils import json
from rest_framework.test import APIClient
from test_plus.test import TestCase

from adoorback.utils.seed import set_seed


from account.models import Friendship, FriendRequest

User = get_user_model()
N = 10


class UserTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_user_count(self):
<<<<<<< HEAD
        self.assertEqual(User.objects.all().count(), 3)
=======
        self.assertEqual(User.objects.count(), 3)
>>>>>>> 7881f87c1121d0ecd606487c97ba9f0b74f3e8a3

    def test_str(self):
        user = User.objects.last()
        self.assertEqual(user.type, 'User')


class UserFriendshipCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_friendship_count(self):
        self.assertEqual(Friendship.objects.all().count(), 4)

    def test_friendship_str(self):
        friendship = Friendship.objects.first()
        self.assertEqual(friendship.type, 'Friendship')
        self.assertEqual(friendship.__str__(),
                         f'{friendship.user} & {friendship.friend}')

    def test_on_delete_user_cascade(self):
        user = User.objects.get(id=1)
        self.assertEqual(user.friends.all().count(), 1)

        user.delete()
        self.assertEqual(User.objects.all().filter(id=1).count(), 0)
        self.assertEqual(Friendship.objects.all().filter(user_id=1).count(), 0)
        self.assertEqual(Friendship.objects.all().filter(
            friend_id=1).count(), 0)


class FriendRequestTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_friend_request_count(self):
        self.assertEqual(FriendRequest.objects.all().count(), 3)

    def test_friend_request_str(self):
        friendrequest = FriendRequest.objects.first()
        self.assertEqual(friendrequest.type, 'FriendRequest')
        self.assertEqual(friendrequest.__str__(),
                         f'{friendrequest.requester} sent to {friendrequest.responder} ({friendrequest.responded})')

    def test_on_delete_requester_cascade(self):
        user = FriendRequest.objects.all().first().requester
        sent_friend_requests = user.sent_friend_requests.all()
        self.assertGreater(sent_friend_requests.count(), 0)

        user.delete()
        self.assertEqual(User.objects.all().filter(id=user.id).count(), 0)
        self.assertEqual(FriendRequest.objects.all().filter(
            requester_id=user.id).count(), 0)
        self.assertEqual(FriendRequest.objects.all().filter(
            responder_id=user.id).count(), 0)

    def test_on_delete_responder_cascade(self):
        user = FriendRequest.objects.all().first().responder
        received_friend_requests = user.received_friend_requests.all()
        self.assertGreater(received_friend_requests.count(), 0)

        user.delete()
        self.assertEqual(User.objects.all().filter(id=user.id).count(), 0)
        self.assertEqual(FriendRequest.objects.all().filter(
            responder_id=user.id).count(), 0)
        self.assertEqual(FriendRequest.objects.all().filter(
            requester_id=user.id).count(), 0)


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
            response = self.get('user-friend-list')
            self.assertEqual(response.status_code, 200)

    def test_user_friend_detail(self):
        current_user = self.make_user(username='current_user')
        friend_user = self.make_user(username='friend_user')
        Friendship.objects.create(user=current_user, friend=friend_user)

        with self.login(username=current_user.username, password='password'):
            response = self.get(
                reverse('user-friend-detail', args=[friend_user.id]))
            self.assertEqual(response.status_code, 200)
            response = self.delete(
                reverse('user-friend-detail', args=[friend_user.id]))
            self.assertEqual(response.status_code, 204)

        with self.login(username=current_user.username, password='password'):
            data = {"user_id": current_user.id, "friend_id": friend_user.id}
            response = self.post(
                reverse('user-friend-detail', args=[friend_user.id]), data=data)
            self.assertEqual(response.status_code, 201)


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
        client = Client()

        response = client.get('/api/user/me/')
        self.assertEqual(response.status_code, 401)

        response = client.post('/api/user/me/', {},
                               content_type='application/json')
        self.assertEqual(response.status_code, 405)

        self.make_user(username="test_user", password="test_pw")
        with self.login(username="test_user", password="test_pw"):
            response = self.get('current-user')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()['username'], "test_user")


class FriendRequestAPITestCase(APITestCase):

    def setUp(self):
        set_seed(N)

    def test_friend_request_list(self):
        current_user = self.make_user(username='current_user')
        friend_user_1 = self.make_user(username='friend_user_1')
        friend_user_2 = self.make_user(username='friend_user_2')

        FriendRequest.objects.create(
            requester=current_user, responder=friend_user_1, responded=False)
        FriendRequest.objects.create(
            requester=current_user, responder=friend_user_2, responded=False)
        FriendRequest.objects.create(
            requester=friend_user_1, responder=friend_user_2, responded=False)

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

        FriendRequest.objects.create(
            requester=current_user, responder=friend_user_1, responded=False)
        FriendRequest.objects.create(
            requester=current_user, responder=friend_user_2, responded=False)
        FriendRequest.objects.create(
            requester=friend_user_1, responder=friend_user_2, responded=False)

        # GET FriendRequest (current_user -> friend_user_1)
        with self.login(username=current_user.username, password='password'):
            response = self.get(self.reverse(
                'user-friend-request-detail', rid=friend_user_1.id))
            self.assertEqual(response.status_code, 200)

        # POST FriendRequest (friend_user_2 -> friend_user_1)
        with self.login(username=friend_user_2.username, password='password'):
            data = {"requester_id": friend_user_2.id,
                    "responder_id": friend_user_1.id}
            response = self.post(
                reverse('user-friend-request-detail', args=[friend_user_1.id]), data=data)
            self.assertEqual(response.status_code, 201)

        # DELETE FriendRequest (friend_user_2 -> friend_user_1)
        with self.login(username=friend_user_2.username, password='password'):
            response = self.delete(self.reverse(
                'user-friend-request-detail', rid=friend_user_1.id))
            self.assertEqual(response.status_code, 204)

        # POST FriendRequest (friend_user_2 -> friend_user_1) again
        with self.login(username=friend_user_2.username, password='password'):
            data = {"requester_id": friend_user_2.id,
                    "responder_id": friend_user_1.id}
            response = self.post(
                reverse('user-friend-request-detail', args=[friend_user_1.id]), data=data)
            self.assertEqual(response.status_code, 201)

        # PATCH FriendRequest (friend_user_2 -> friend_user_1)
        with self.login(username=friend_user_2.username, password='password'):
            data = {"responded": True}
            response = self.patch(
                reverse('user-friend-request-detail', args=[friend_user_1.id]), data=data)
            self.assertEqual(response.status_code, 200)

        # Check if friend_user_2 has friend_user_1 as friend
        with self.login(username=friend_user_2.username, password='password'):
            response = self.get('user-friend-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], 1)

        # Check if friend_user_1 has friend_user_2 as friend as well
        with self.login(username=friend_user_1.username, password='password'):
            response = self.get('user-friend-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], 1)
