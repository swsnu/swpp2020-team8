from django.contrib.auth import get_user_model
from test_plus.test import TestCase
from rest_framework.test import APIClient

from comment.models import Comment

from adoorback.utils.seed import set_seed
from adoorback.utils.content_types import get_content_type

User = get_user_model()
N = 10


class CommentTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_comment_count(self):
        self.assertEqual(Comment.objects.all().count(), N*3)

    def test_comment_str(self):
        comment = Comment.objects.last()
        self.assertEqual(comment.__str__(), comment.content)
        self.assertEqual(comment.type, 'Comment')

    # comments of user must be deleted accordingly
    def test_on_delete_user_cascade(self):
        user = User.objects.get(id=2)
        comments = user.comment_set.all()
        self.assertGreater(comments.count(), 0)

        user.delete()
        self.assertEqual(User.objects.all().filter(id=2).count(), 0)
        self.assertEqual(Comment.objects.all().filter(author_id=2).count(), 0)

    # comment must be deleted along with target
    def test_on_delete_feed_cascade(self):
        article = Comment.objects.all().filter(content_type=get_content_type("Article")).last().target
        response = Comment.objects.all().filter(content_type=get_content_type("Response")).last().target
        article_id = article.id
        response_id = response.id
        self.assertGreater(article.article_comments.all().count(), 0)
        self.assertGreater(response.response_comments.all().count(), 0)

        article.delete()
        response.delete()
        self.assertEqual(Comment.objects.all().filter(content_type=get_content_type("Article"),
                                                      object_id=article_id).count(), 0)
        self.assertEqual(Comment.objects.all().filter(content_type=get_content_type("Response"),
                                                      object_id=response_id).count(), 0)

    # comment must also work properly when target is Comment
    def test_reply_comment(self):
        reply = Comment.objects.all().filter(content_type=get_content_type("Comment")).last()
        reply_id = reply.id
        comment_id = reply.object_id

        Comment.objects.get(id=comment_id).delete()
        self.assertEqual(Comment.objects.all().filter(id=comment_id).count(), 0)
        self.assertEqual(Comment.objects.all().filter(id=reply_id).count(), 0)


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
            response = self.post('comment-list', data=data)
            self.assertEqual(response.status_code, 201)
            comment_id = Comment.objects.last().id
            data = {"target_type": "Comment", "target_id": comment_id, "content": "test_reply"}
            response = self.post('comment-list', data=data)
            self.assertEqual(response.status_code, 201)

            response = self.get('comment-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['results'][1]['is_reply'], False)
            self.assertEqual(response.data['results'][1]['replies'][0]['is_reply'], True)

    def test_comment_create(self):
        current_user = self.make_user(username='current_user')

        with self.login(username=current_user.username, password='password'):
            data = {"target_type": "Response", "target_id": 1, "content": "test_comment"}
            response = self.post('comment-list', data=data)
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.data['type'], "Comment")
            self.assertEqual(response.data['is_reply'], False)

    def test_reply_create(self):
        current_user = self.make_user(username='current_user')

        with self.login(username=current_user.username, password='password'):
            data = {"target_type": "Comment", "target_id": 1, "content": "test_reply"}
            response = self.post('comment-list', data=data)
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.data['type'], "Comment")
            self.assertEqual(response.data['is_reply'], True)

    def test_restrictions(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        with self.login(username=current_user.username, password='password'):
            data = {"target_type": "Comment", "target_id": 1, "content": "test_reply"}
            response = self.post('comment-list', data=data)
            self.assertEqual(response.status_code, 201)

        with self.login(username=current_user.username, password='password'):
            pk = Comment.objects.last().id
            response = self.delete(self.reverse('comment-detail', pk=pk))
            self.assertEqual(response.status_code, 204)

        with self.login(username=current_user.username, password='password'):
            data = {"target_type": "Comment", "target_id": 1, "content": "test_reply"}
            response = self.post('comment-list', data=data)
            self.assertEqual(response.status_code, 201)

        with self.login(username=spy_user.username, password='password'):
            pk = Comment.objects.last().id
            response = self.delete(self.reverse('comment-detail', pk=pk))
            self.assertEqual(response.status_code, 403)
