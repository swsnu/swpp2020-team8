from test_plus.test import TestCase

from django.contrib.auth import get_user_model

from feed.models import Article, Response, Question, Post

from adoorback.utils.seed import set_seed, fill_data
from adoorback.utils.content_types import get_content_type


User = get_user_model()
N = 10


class FeedTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_feed_count(self):
        self.assertEqual(Article.objects.all().count(), N)
        self.assertEqual(Question.objects.admin_questions_only().count(), N)
        self.assertEqual(Question.objects.custom_questions_only().count(), N)
        self.assertEqual(Response.objects.all().count(), N)
        self.assertEqual(Post.objects.all().count(), N*4)

    def test_feed_str(self):
        article = Article.objects.create(author_id=1, content="test_content")
        self.assertEqual(article.__str__(), article.content)

    # all feeds must be deleted along with user
    def test_on_delete_user_cascade(self):
        fill_data()
        user = User.objects.get(id=2)
        articles = user.article_set.all()
        responses = user.response_set.all()
        questions = user.question_set.all()
        self.assertGreater(articles.count(), 0)
        self.assertGreater(responses.count(), 0)
        self.assertGreater(questions.count(), 0)

        user.delete()
        self.assertEqual(User.objects.all().filter(id=2).count(), 0)
        self.assertEqual(Article.objects.all().filter(author_id=2).count(), 0)
        self.assertEqual(Response.objects.all().filter(author_id=2).count(), 0)
        self.assertEqual(Question.objects.all().filter(author_id=2).count(), 0)

    # response must be deleted along with question
    def test_on_delete_question_cascade(self):
        response = Response.objects.all().last()
        response_id = response.id

        response.question.delete()
        self.assertEqual(Response.objects.all().filter(id=response_id).count(), 0)

    # post content must change to reflect target content
    def test_post_update(self):
        response = Response.objects.all().last()
        response.content = "modified content"
        response.save()

        self.assertEqual(Post.objects.all().filter(content_type=get_content_type("response"),
                                                   object_id=response.id).last().content, response.content)

    # post content must be removed along with target
    def test_post_delete(self):
        response = Response.objects.all().last()
        response.delete()

        self.assertEqual(Post.objects.all().filter(object_id=response.id).count(), 0)
