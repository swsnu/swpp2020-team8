from django.contrib.auth import get_user_model
from test_plus.test import TestCase
from rest_framework.test import APIClient

from comment.models import Comment
from feed.models import Response, Article
from notification.models import Notification

from adoorback.utils.seed import set_seed, fill_data
from adoorback.utils.content_types import get_article_type, get_response_type, get_comment_type

User = get_user_model()
N = 10


class CommentTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_comment_count(self):
        self.assertEqual(Comment.objects.count(), N*3)

    def test_comment_str(self):
        comment = Comment.objects.last()
        self.assertEqual(comment.__str__(), comment.content)
        self.assertEqual(comment.type, 'Comment')

    # comments of user must be deleted accordingly
    def test_on_delete_user_cascade(self):
        fill_data()
        user = User.objects.get(id=2)
        comments = user.comment_set.all()
        self.assertGreater(comments.count(), 0)

        user.delete()
        self.assertEqual(User.objects.filter(id=2).count(), 0)
        self.assertEqual(Comment.objects.filter(author_id=2).count(), 0)

    # comment must be deleted along with target
    def test_on_delete_feed_cascade(self):
        article = Comment.objects.filter(content_type=get_article_type()).last().target
        response = Comment.objects.filter(content_type=get_response_type()).last().target
        article_id = article.id
        response_id = response.id
        self.assertGreater(article.article_comments.count(), 0)
        self.assertGreater(response.response_comments.count(), 0)

        article.delete()
        response.delete()
        self.assertEqual(Comment.objects.filter(content_type=get_article_type(),
                                                object_id=article_id).count(), 0)
        self.assertEqual(Comment.objects.filter(content_type=get_response_type(),
                                                object_id=response_id).count(), 0)

    # comment must also work properly when target is Comment
    def test_reply_comment(self):
        reply = Comment.objects.filter(content_type=get_comment_type()).last()
        reply_id = reply.id
        comment_id = reply.object_id

        Comment.objects.get(id=comment_id).delete()
        self.assertEqual(Comment.objects.filter(id=comment_id).count(), 0)
        self.assertEqual(Comment.objects.filter(id=reply_id).count(), 0)


class APITestCase(TestCase):
    client_class = APIClient


class CommentAPITestCase(APITestCase):

    def setUp(self):
        set_seed(N)

    def test_comment_list(self):
        current_user = self.make_user(username='current_user')

        with self.login(username=current_user.username, password='password'):
            response = self.get('comment-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], N*3)

    def test_reply_list(self):
        current_user = self.make_user(username='current_user')

        with self.login(username=current_user.username, password='password'):
            data = {"target_type": "Article", "target_id": 1, "content": "test_comment"}
            response = self.post('comment-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)
            comment_id = Comment.objects.last().id
            data = {"target_type": "Comment", "target_id": comment_id, "content": "test_reply"}
            response = self.post('comment-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)

            response = self.get('comment-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['results'][1]['is_reply'], False)
            self.assertEqual(response.data['results'][1]['replies'][0]['is_reply'], True)

    def test_comment_create(self):
        current_user = self.make_user(username='current_user')

        with self.login(username=current_user.username, password='password'):
            data = {"target_type": "Response", "target_id": 1, "content": "test_comment"}
            response = self.post('comment-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.data['type'], "Comment")
            self.assertEqual(response.data['is_reply'], False)

    def test_reply_create(self):
        current_user = self.make_user(username='current_user')

        with self.login(username=current_user.username, password='password'):
            data = {"target_type": "Comment", "target_id": 1, "content": "test_reply"}
            response = self.post('comment-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.data['type'], "Comment")
            self.assertEqual(response.data['is_reply'], True)

    def test_restrictions(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        with self.login(username=current_user.username, password='password'):
            data = {"target_type": "Comment", "target_id": 1, "content": "test_reply"}
            response = self.post('comment-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)

        with self.login(username=current_user.username, password='password'):
            pk = Comment.objects.last().id
            response = self.delete(self.reverse('comment-detail', pk=pk))
            self.assertEqual(response.status_code, 204)

        with self.login(username=current_user.username, password='password'):
            data = {"target_type": "Comment", "target_id": 1, "content": "test_reply"}
            response = self.post('comment-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)

        with self.login(username=spy_user.username, password='password'):
            pk = Comment.objects.last().id
            response = self.delete(self.reverse('comment-detail', pk=pk))
            self.assertEqual(response.status_code, 403)


class CommentNotiAPITestCase(APITestCase):

    def setUp(self):
        set_seed(N)

    def test_create_comment_noti(self):
        current_user = self.make_user(username='current_user')

        # create comment (current_user -> author of Article with id=1)
        with self.login(username=current_user.username, password='password'):
            num_notis_before = Notification.objects.count()
            data = {"target_type": "Article", "target_id": 1, "content": "test_comment"}
            response = self.post('comment-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)

            num_notis_after = Notification.objects.count()
            self.assertEqual(num_notis_before, num_notis_after - 1)
            comment_noti = Notification.objects.first()  # notification is order_by '-updated_at'
            self.assertEqual(comment_noti.message,
                             "current_user님이 회원님의 게시글에 댓글을 남겼습니다.")
            self.assertEqual(comment_noti.user, Article.objects.get(id=1).author)

        # create comment (current_user -> author of Response with id=1)
        with self.login(username=current_user.username, password='password'):
            data = {"target_type": "Response", "target_id": 1, "content": "test_comment"}
            response = self.post('comment-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)

            self.assertEqual(Notification.objects.first().message,
                             "current_user님이 회원님의 답변에 댓글을 남겼습니다.")  # different message

        # create comment (current_user -> current_user): no new notification
        with self.login(username=current_user.username, password='password'):
            article = Article.objects.create(author=current_user, content="test article")
            num_notis_before = Notification.objects.count()
            data = {"target_type": "Article", "target_id": article.id, "content": "test_comment"}
            response = self.post('comment-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)

            num_notis_after = Notification.objects.count()
            self.assertEqual(num_notis_before, num_notis_after)  # comment noti should not have been created

    def test_create_reply_noti(self):
        current_user = self.make_user(username='current_user')

        # create comment (current_user -> author of Comment with id=1)
        with self.login(username=current_user.username, password='password'):
            num_notis_before = Notification.objects.count()
            data = {"target_type": "Comment", "target_id": 1, "content": "test_reply"}
            response = self.post('comment-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)

            num_notis_after = Notification.objects.count()
            self.assertEqual(num_notis_before, num_notis_after - 1)
            reply_noti = Notification.objects.first()  # notification is order_by '-updated_at'
            self.assertEqual(reply_noti.message,
                             "current_user님이 회원님의 댓글에 답글을 남겼습니다.")
            self.assertEqual(reply_noti.user, Comment.objects.get(id=1).author)

        # create reply (current_user -> current_user): no new notification
        with self.login(username=current_user.username, password='password'):
            comment = Comment.objects.create(author=current_user, content="test comment",
                                             target=Article.objects.last())
            num_notis_before = Notification.objects.count()
            data = {"target_type": "Comment", "target_id": comment.id, "content": "test_reply"}
            response = self.post('comment-list', data=data, extra={'format': 'json'})
            self.assertEqual(response.status_code, 201)

            num_notis_after = Notification.objects.count()
            self.assertEqual(num_notis_before, num_notis_after)  # reply noti should not have been created
