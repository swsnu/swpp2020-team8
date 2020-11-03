from django.test import TestCase
from comment.models import Comment
from feed.models import Feed
from adoorback.utils.seed import set_seed
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType

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

    def test_on_delete_user_cascade(self):
        user = User.objects.get(id=2)
        comments = user.commented_set.all()
        self.assertGreater(comments.count(), 0)  # No comments for chosen author, redo test!

        user.delete()
        self.assertEqual(User.objects.all().filter(id=2).count(), 0)
        self.assertEqual(Comment.objects.all().filter(author_id=2).count(), 0)

    # comment must be deleted along with target
    def test_on_delete_feed_cascade(self):
        feed = Feed.objects.all().last()
        feed_id = feed.id

        feed.delete()
        self.assertEqual(Comment.objects.all().filter(object_id=feed_id).count(), 0)

    # comment must also work properly when target is Comment
    def test_reply_comment(self):
        reply = Comment.objects.all().filter(content_type=ContentType.objects.get_for_model(Comment)).last()
        reply_id = reply.id
        comment_id = reply.object_id

        Comment.objects.get(id=comment_id).delete()
        self.assertEqual(Comment.objects.all().filter(id=comment_id).count(), 0)
        self.assertEqual(Comment.objects.all().filter(id=reply_id).count(), 0)
