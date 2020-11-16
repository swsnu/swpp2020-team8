from django.test import TestCase
from django.contrib.auth import get_user_model

from like.models import Like

from adoorback.utils.seed import set_seed, fill_data
from adoorback.utils.content_types import get_content_type


User = get_user_model()
N = 10


class LikeTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_like_count(self):
        self.assertEqual(Like.objects.all().count(), N*5)

    def test_like_str(self):
        like = Like.objects.all().last()
        self.assertEqual(like.__str__(), f'{like.user} likes {like.content_type} ({like.object_id})')
        self.assertEqual(like.type, 'Like')

    def test_on_delete_user_cascade(self):
        fill_data()
        user = User.objects.get(id=2)
        self.assertGreater(user.like_set.all().count(), 0)

        user.delete()
        self.assertEqual(User.objects.all().filter(id=2).count(), 0)
        self.assertEqual(Like.objects.all().filter(user_id=2).count(), 0)

    # like must be deleted along with target Feed
    def test_on_delete_feed_cascade(self):
        article_model = get_content_type("article")
        question_model = get_content_type("question")
        article = Like.objects.all().filter(content_type=article_model).last().target
        question = Like.objects.all().filter(content_type=question_model).last().target
        self.assertGreater(article.article_likes.all().count(), 0)
        self.assertGreater(question.question_likes.all().count(), 0)

        article_id = article.id
        question_id = question.id
        article.delete()
        question.delete()
        self.assertEqual(Like.objects.all().filter(content_type=article_model, object_id=article_id).count(), 0)
        self.assertEqual(Like.objects.all().filter(content_type=question_model, object_id=question_id).count(), 0)

    # like must be deleted along with target Comment
    def test_delete_comment_cascade(self):
        content_type = get_content_type("comment")
        comment = Like.objects.all().filter(content_type=content_type).last().target
        object_id = comment.id
        self.assertGreater(comment.comment_likes.all().count(), 0)

        comment.delete()
        self.assertEqual(Like.objects.all().filter(content_type=content_type, object_id=object_id).count(), 0)
