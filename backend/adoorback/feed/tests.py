from test_plus.test import TestCase
from rest_framework.test import APIClient

from django.contrib.auth import get_user_model

from feed.models import Article, Response, Question, Post, ResponseRequest

from adoorback.utils.seed import set_seed, fill_data
from adoorback.utils.content_types import get_content_type


User = get_user_model()
N = 10


class FeedModelTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_feed_count(self):
        self.assertEqual(Article.objects.all().count(), N)
        self.assertEqual(Question.objects.admin_questions_only().count(), N)
        self.assertEqual(Question.objects.custom_questions_only().count(), N)
        self.assertLessEqual(Question.objects.daily_questions().count(), 30)
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

        self.assertEqual(Post.objects.all().filter(content_type=get_content_type("Response"),
                                                   object_id=response.id).last().content, response.content)

    # post content must be removed along with target
    def test_post_delete(self):
        response = Response.objects.all().last()
        response.delete()

        self.assertEqual(Post.objects.all().filter(object_id=response.id).count(), 0)

class ResponseRequestTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_response_request_count(self):
        self.assertEqual(ResponseRequest.objects.all().count(), N)

    def test_on_delete_user_cascade(self):
        user = ResponseRequest.objects.all().first().actor
        sent_response_requests = user.sent_response_request_set.all()
        received_response_requests = user.received_response_request_set.all()
        self.assertGreater(sent_response_requests.count(), 0)
        self.assertGreater(received_response_requests.count(), 0)

        user.delete()
        self.assertEqual(User.objects.all().filter(id=user.id).count(), 0)
        self.assertEqual(ResponseRequest.objects.all().filter(actor_id=user.id).count(), 0)
        self.assertEqual(ResponseRequest.objects.all().filter(recipient_id=user.id).count(), 0)

    def test_on_delete_question_cascade(self):
        question = ResponseRequest.objects.all().first().question
        response_request = ResponseRequest.objects.all().filter(question_id=question.id)
        self.assertGreater(response_request.count(), 0)

        question.delete()
        self.assertEqual(ResponseRequest.objects.all().filter(question_id=question.id).count(), 0)

class APITestCase(TestCase):
    client_class = APIClient


class PostAPITestCase(APITestCase):

    def test_friend_feed(self):
        current_user = self.make_user(username='current_user')

        Question.objects.create(author_id=1, content="test_question", is_admin_question=False)
        Response.objects.create(author_id=1, content="test_response", question_id=1)
        Article.objects.create(author_id=1, content="test_article")
        Article.objects.create(author_id=1, content="test_article", share_with_friends=False)

        with self.login(username=current_user.username, password='password'):
            response = self.get('friend-feed-post-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data['results']), 3)
            self.assertEqual(response.data['results'][0]['type'], 'Article')
            self.assertEqual(response.data['results'][1]['type'], 'Response')
            self.assertEqual(response.data['results'][2]['type'], 'Question')
            self.assertEqual(response.data['results'][0]['share_with_friends'], True)

    def test_anonymous_feed(self):
        current_user = self.make_user(username='current_user')

        Question.objects.create(author_id=1, content="test_question", is_admin_question=False)
        Response.objects.create(author_id=1, content="test_response", question_id=1)
        Article.objects.create(author_id=1, content="test_article")
        Article.objects.create(author_id=1, content="test_article", share_anonymously=False)

        with self.login(username=current_user.username, password='password'):
            response = self.get('anonymous-feed-post-list')
            self.assertEqual(len(response.data['results']), 3)
            self.assertEqual(response.data['results'][0]['share_anonymously'], True)


class ArticleAPITestCase(APITestCase):

    def test_restrictions(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        with self.login(username=current_user.username, password='password'):
            data = {"content": "test content"}
            response = self.post('article-list', data=data)
            self.assertEqual(response.status_code, 201)

        data = {"content": "modified content"}
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('article-detail', pk=1), data=data)
            self.assertEqual(response.status_code, 200)

        with self.login(username=spy_user.username, password='password'):
            response = self.patch(self.reverse('article-detail', pk=1), data=data)
            self.assertEqual(response.status_code, 403)


class QuestionAPITestCase(APITestCase):

    def test_restrictions(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        with self.login(username=current_user.username, password='password'):
            data = {"content": "test content", "is_admin_question": True}
            response = self.post('question-list', data=data)
            self.assertEqual(response.status_code, 201)

        data = {"content": "modified content"}
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('question-detail', pk=1), data=data)
            self.assertEqual(response.status_code, 200)

        with self.login(username=spy_user.username, password='password'):
            response = self.patch(self.reverse('question-detail', pk=1), data=data)
            self.assertEqual(response.status_code, 403)


class ResponseAPITestCase(APITestCase):

    def test_restrictions(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        with self.login(username=current_user.username, password='password'):
            question = Question.objects.create(author_id=1, content="test_question", is_admin_question=False)
            data = {"content": "test content", "question_id": question.id}
            response = self.post('response-list', data=data)
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.data['question_id'], Response.objects.all().last().question_id)

        data = {"content": "modified content"}
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('response-detail', pk=1), data=data)
            self.assertEqual(response.status_code, 200)

        with self.login(username=spy_user.username, password='password'):
            response = self.patch(self.reverse('response-detail', pk=1), data=data)
            self.assertEqual(response.status_code, 403)


class DailyQuestionTestCase(APITestCase):

    def test_daily_questions_call(self):
        current_user = self.make_user(username='current_user')

        for _ in range(50):
            Question.objects.create(author_id=1, content="test_question", is_admin_question=False)

        with self.login(username=current_user.username, password='password'):
            response = self.get('daily-question-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], 30)
            self.assertEqual(len(response.data['results']), 10)
            self.assertTrue(response.data['results'][1]['selected_date'])
            self.assertGreater(response.data['results'][1]['id'],
                               response.data['results'][2]['id'])  # check order_by
