from django.test import TestCase
from like.models import Like
from comment.models import Comment
from feed.models import Feed, Question
from adoorback.utils.seed import set_seed
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType


User = get_user_model()
N = 10


class LikeTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_like_count(self):
        self.assertEqual(Like.objects.all().count(), N*4)

    def test_like_str(self):
        like = Like.objects.all().last()
        self.assertEqual(like.__str__(), f'{like.user} likes {like.content_type} ({like.object_id})')

    def test_on_delete_user_cascade(self):
        user = User.objects.get(id=2)
        likes = user.liked_set.all()
        self.assertGreater(likes.count(), 0)  # No likes for chosen user, redo test!

        user.delete()
        self.assertEqual(User.objects.all().filter(id=2).count(), 0)
        self.assertEqual(Like.objects.all().filter(user_id=2).count(), 0)

    # like must be deleted along with target Feed
    def test_on_delete_feed_cascade(self):
        posts = Feed.objects.all().not_instance_of(Question)
        questions = Question.objects.all()
        post_id = posts.last().id
        question_id = questions.last().id
        post_type = ContentType.objects.get_for_model(posts.last())
        question_type = ContentType.objects.get_for_model(questions.last())

        posts.last().delete()
        questions.last().delete()
        self.assertEqual(Like.objects.all().filter(content_type=post_type, object_id=post_id).count(), 0)
        self.assertEqual(Like.objects.all().filter(content_type=question_type, object_id=question_id).count(), 0)

    # like must be deleted along with target Comment
    def test_delete_comment_cascade(self):
        comment = Comment.objects.all().filter().last()
        content_type = ContentType.objects.get_for_model(Comment)
        object_id = comment.id

        comment.delete()
        self.assertEqual(Like.objects.all().filter(content_type=content_type, object_id=object_id).count(), 0)
