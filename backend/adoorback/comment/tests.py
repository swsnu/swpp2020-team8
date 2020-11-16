from django.test import TestCase
from django.contrib.auth import get_user_model

from comment.models import Comment

from adoorback.utils.seed import set_seed, fill_data
from adoorback.utils.content_types import get_content_type


User = get_user_model()
N = 10


class CommentTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_comment_count(self):
        self.assertEqual(Comment.objects.all().count(), N*3)

    def test_comment_str(self):
        comment = Comment.objects.all().last()
        self.assertEqual(comment.__str__(), comment.content)
        self.assertEqual(comment.type, 'Comment')

    # comments of user must be deleted accordingly
    def test_on_delete_user_cascade(self):
        fill_data()
        user = User.objects.get(id=2)
        comments = user.comment_set.all()
        self.assertGreater(comments.count(), 0)

        user.delete()
        self.assertEqual(User.objects.all().filter(id=2).count(), 0)
        self.assertEqual(Comment.objects.all().filter(author_id=2).count(), 0)

    # comment must be deleted along with target
    def test_on_delete_feed_cascade(self):
        article = Comment.objects.all().filter(content_type=get_content_type("article")).last().target
        response = Comment.objects.all().filter(content_type=get_content_type("response")).last().target
        article_id = article.id
        response_id = response.id
        self.assertGreater(article.article_comments.all().count(), 0)
        self.assertGreater(response.response_comments.all().count(), 0)

        article.delete()
        response.delete()
        self.assertEqual(Comment.objects.all().filter(content_type=get_content_type("article"),
                                                      object_id=article_id).count(), 0)
        self.assertEqual(Comment.objects.all().filter(content_type=get_content_type("response"),
                                                      object_id=response_id).count(), 0)

    # comment must also work properly when target is Comment
    def test_reply_comment(self):
        reply = Comment.objects.all().filter(content_type=get_content_type("comment")).last()
        reply_id = reply.id
        comment_id = reply.object_id

        Comment.objects.get(id=comment_id).delete()
        self.assertEqual(Comment.objects.all().filter(id=comment_id).count(), 0)
        self.assertEqual(Comment.objects.all().filter(id=reply_id).count(), 0)
