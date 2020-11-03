from django.test import TestCase
from feed.models import Feed, Article, AdminQuestion, CustomQuestionPost, Response, Question
from adoorback.utils.seed import set_seed
from django.contrib.auth import get_user_model


User = get_user_model()
N = 10


class FeedTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_feed_count(self):
        self.assertEqual(Article.objects.all().count(), N)
        self.assertEqual(AdminQuestion.objects.all().count(), N)
        self.assertEqual(CustomQuestionPost.objects.all().count(), N)
        self.assertEqual(Response.objects.all().count(), N)

    def test_feed_str(self):
        article = Article.objects.create(author_id=1, content="test_content")
        self.assertEqual(article.__str__(), article.content)

    def test_on_delete_user_cascade(self):
        user = User.objects.get(id=2)
        feeds = user.feed_set.all()
        self.assertGreater(feeds.count(), 0)  # No comments for chosen author, redo test!

        user.delete()
        self.assertEqual(User.objects.all().filter(id=2).count(), 0)
        self.assertEqual(Feed.objects.all().filter(author_id=2).count(), 0)

    # TODO: admin question behavior should be tested @view
    def test_on_delete_question_cascade(self):
        response = Response.objects.select_related('content_type').all().last()
        response_id = response.id
        # response must be deleted along with question
        response.target.delete()
        self.assertEqual(Response.objects.all().filter(id=response_id).count(), 0)
