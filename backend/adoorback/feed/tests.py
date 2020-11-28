import datetime

from test_plus.test import TestCase
from rest_framework.test import APIClient

from django.contrib.auth import get_user_model

from feed.models import Article, Response, Question, Post, ResponseRequest
from notification.models import Notification

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
        response = Response.objects.last()
        response_id = response.id

        response.question.delete()
        self.assertEqual(Response.objects.all().filter(id=response_id).count(), 0)

    # post content must change to reflect target content
    def test_post_update(self):
        response = Response.objects.last()
        response.content = "modified content"
        response.save()

        self.assertEqual(Post.objects.all().filter(content_type=get_content_type("Response"),
                                                   object_id=response.id).last().content, response.content)

    # post content must be removed along with target
    def test_post_delete(self):
        response = Response.objects.last()
        response.delete()

        self.assertEqual(Post.objects.all().filter(object_id=response.id).count(), 0)


class ResponseRequestTestCase(TestCase):
    def setUp(self):
        set_seed(N)

    def test_response_request_count(self):
        self.assertGreater(ResponseRequest.objects.count(), 0)  # due to unique constraint

    def test_on_delete_actor_cascade(self):
        user = ResponseRequest.objects.all().first().requester
        sent_response_requests = user.sent_response_request_set.all()
        self.assertGreater(sent_response_requests.count(), 0)

        user.delete()
        self.assertEqual(User.objects.all().filter(id=user.id).count(), 0)
        self.assertEqual(ResponseRequest.objects.all().filter(requester_id=user.id).count(), 0)
        self.assertEqual(ResponseRequest.objects.all().filter(requestee_id=user.id).count(), 0)

    def test_on_delete_recipient_cascade(self):
        user = ResponseRequest.objects.first().requestee
        received_response_requests = user.received_response_request_set.all()
        self.assertGreater(received_response_requests.count(), 0)

        user.delete()
        self.assertEqual(User.objects.filter(id=user.id).count(), 0)
        self.assertEqual(ResponseRequest.objects.filter(requestee_id=user.id).count(), 0)
        self.assertEqual(ResponseRequest.objects.filter(requester_id=user.id).count(), 0)

    def test_on_delete_question_cascade(self):
        question = ResponseRequest.objects.first().question
        response_request = ResponseRequest.objects.filter(question_id=question.id)
        self.assertGreater(response_request.count(), 0)

        question.delete()
        self.assertEqual(ResponseRequest.objects.filter(question_id=question.id).count(), 0)

class APITestCase(TestCase):
    client_class = APIClient


class PostAPITestCase(APITestCase):

    def test_friend_feed(self):
        current_user = self.make_user(username='current_user')
        friend_user = self.make_user(username='friend_user')

        question = Question.objects.create(author_id=current_user.id, content="test_question",
                                           is_admin_question=False)
        Response.objects.create(author_id=current_user.id, content="test_response",
                                question_id=question.id)
        Article.objects.create(author_id=current_user.id, content="test_article")
        Article.objects.create(author_id=friend_user.id, content="test_article",
                               share_with_friends=False)

        with self.login(username=current_user.username, password='password'):
            response = self.get('friend-feed-post-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], 3)
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
            self.assertEqual(response.data['count'], 3)
            self.assertEqual(response.data['results'][0]['share_anonymously'], True)

    def test_user_feed(self):
        current_user = self.make_user(username='current_user')
        friend_user = self.make_user(username='friend_user')

        fid = friend_user.id
        Question.objects.create(author_id=fid, content="test_question", is_admin_question=False)
        Response.objects.create(author_id=fid, content="test_response", question_id=1)
        Article.objects.create(author_id=fid, content="test_article")
        Article.objects.create(author_id=fid, content="test_article", share_with_friends=False)

        user_id = User.objects.last().id
        with self.login(username=current_user.username, password='password'):
            response = self.get(self.reverse('user-feed-post-list', pk=user_id))
            self.assertEqual(response.data['count'], 3)


class ArticleAPITestCase(APITestCase):

    def test_restrictions(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        with self.login(username=current_user.username, password='password'):
            data = {"content": "test content", "share_anonymously": True}
            response = self.post('article-list', data=data)
            self.assertEqual(response.status_code, 201)

        article_id = Article.objects.last().id
        data = {"content": "modified content"}
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('article-detail', pk=article_id), data=data)
            self.assertEqual(response.status_code, 200)

        with self.login(username=spy_user.username, password='password'):
            response = self.patch(self.reverse('article-detail', pk=article_id), data=data)
            self.assertEqual(response.status_code, 403)

        # anonymous
        with self.login(username=spy_user.username, password='password'):
            response = self.get(self.reverse('article-detail', pk=article_id))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data['author_detail']), 1)


class QuestionAPITestCase(APITestCase):

    def test_restrictions(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        # seed
        with self.login(username=current_user.username, password='password'):
            data = {"content": "test content", "is_admin_question": True}
            response = self.post('question-list', data=data)
            self.assertEqual(response.status_code, 201)

        question_id = Question.objects.last().id

        data = {"content": "modified content"}
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('question-detail', pk=question_id), data=data)
            self.assertEqual(response.status_code, 200)

        # not allowed
        with self.login(username=spy_user.username, password='password'):
            response = self.patch(self.reverse('question-detail', pk=question_id), data=data)
            self.assertEqual(response.status_code, 403)

    def test_question_detail(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        # seed
        with self.login(username=current_user.username, password='password'):
            data = {"content": "test content", "is_admin_question": True}
            response = self.post('question-list', data=data)
            self.assertEqual(response.status_code, 201)

        question_id = Question.objects.all().last().id
        with self.login(username=current_user.username, password='password'):
            data = {"content": "test content", "question_id": question_id,
                    "share_with_friends": True, "share_anonymously": True}
            response = self.post('response-list', data=data)
            self.assertEqual(response.status_code, 201)
            data = {"content": "test content", "question_id": question_id,
                    "share_with_friends": True, "share_anonymously": False}
            response = self.post('response-list', data=data)
            self.assertEqual(response.status_code, 201)
            data = {"content": "test content", "question_id": question_id,
                    "share_with_friends": False, "share_anonymously": True}
            response = self.post('response-list', data=data)
            self.assertEqual(response.status_code, 201)

        # accessible question detail - anonymous
        with self.login(username=spy_user.username, password='password'):
            response = self.get(self.reverse('question-detail', pk=question_id))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data['response_set']), 2)
            self.assertEqual(len(response.data['author_detail']), 1)  # author anonymous

            # response type toggle
            response = self.get(self.reverse('question-detail-anonymous', pk=question_id))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data['response_set']), 2)
            response = self.get(self.reverse('question-detail-friend', pk=question_id))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data['response_set']), 0)

        # accessible question detail - friend
        with self.login(username=current_user.username, password='password'):
            response = self.get(self.reverse('question-detail', pk=question_id))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data['response_set']), 3)
            self.assertGreater(len(response.data['author_detail']), 1)  # author public

            # response type toggle
            response = self.get(self.reverse('question-detail-anonymous', pk=question_id))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data['response_set']), 2)
            response = self.get(self.reverse('question-detail-friend', pk=question_id))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data['response_set']), 3)


class ResponseAPITestCase(APITestCase):

    def test_restrictions(self):
        current_user = self.make_user(username='current_user')
        spy_user = self.make_user(username='spy_user')

        with self.login(username=current_user.username, password='password'):
            question = Question.objects.create(author_id=1, content="test_question", is_admin_question=False)
            data = {"content": "test content", "question_id": question.id, "share_anonymously": True}
            response = self.post('response-list', data=data)
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.data['question_id'], Response.objects.last().question_id)

        response_id = Response.objects.last().id
        data = {"content": "modified content"}
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('response-detail', pk=response_id), data=data)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['question_id'], Question.objects.last().id)

        with self.login(username=spy_user.username, password='password'):
            response = self.patch(self.reverse('response-detail', pk=response_id), data=data)
            self.assertEqual(response.status_code, 403)

        # anonymous
        with self.login(username=spy_user.username, password='password'):
            response = self.get(self.reverse('response-detail', pk=response_id))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data['author_detail']), 1)
            self.assertEqual(response.data['question_id'], Question.objects.last().id)


class DailyQuestionTestCase(APITestCase):

    def test_daily_questions_call(self):
        current_user = self.make_user(username='current_user')

        for _ in range(50):
            Question.objects.create(author_id=1, content="test_question", is_admin_question=False)

        with self.login(username=current_user.username, password='password'):
            response = self.get('daily-question-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], 30)
            self.assertEqual(len(response.data['results']), 15)
            self.assertTrue(response.data['results'][1]['selected_date'])
            self.assertGreater(response.data['results'][1]['id'],
                               response.data['results'][2]['id'])  # check order_by

    def test_recommended_questions_call(self):
        current_user = self.make_user(username='current_user')

        for _ in range(50):
            Question.objects.create(author_id=1, content="test_question", is_admin_question=False)

        with self.login(username=current_user.username, password='password'):
            response = self.get('daily-question-list')
            self.assertEqual(response.status_code, 200)
            response = self.get('recommended-question-list')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['count'], 5)
            self.assertIn(datetime.date.today().strftime("%Y-%m-%d"),
                          response.data['results'][1]['selected_date'])
            self.assertIn(datetime.date.today().strftime("%Y-%m-%d"),
                          response.data['results'][1]['selected_date'])


class ResponseRequestAPITestCase(APITestCase):

    def setUp(self):
        set_seed(N)

    def test_response_request_list(self):
        current_user = self.make_user(username='current_user')
        friend_user_1 = self.make_user(username='friend_user_1')
        friend_user_2 = self.make_user(username='friend_user_2')

        question_1 = Question.objects.create(author_id=current_user.id,
                                            content="test_question", is_admin_question=False)
        question_2 = Question.objects.create(author_id=current_user.id,
                                            content="test_question", is_admin_question=False)

        prev_noti_count = Notification.objects.count()
        ResponseRequest.objects.create(requester=current_user, requestee=friend_user_1, question=question_1)
        ResponseRequest.objects.create(requester=current_user, requestee=friend_user_2, question=question_2)
        ResponseRequest.objects.create(requester=friend_user_1, requestee=friend_user_2, question=question_1)
        curr_noti_count = Notification.objects.count()
        self.assertGreater(curr_noti_count, prev_noti_count)

        with self.login(username=current_user.username, password='password'):
            response = self.get(self.reverse('response-request-list', qid=question_1.id))
            self.assertEqual(response.status_code, 200)

    def test_response_request_detail(self):
        current_user = self.make_user(username='current_user')
        friend_user = self.make_user(username='friend_user')
        user_adoor = User.objects.get(username='adoor')

        question = Question.objects.create(author_id=current_user.id, content="test_question", is_admin_question=False)
        ResponseRequest.objects.create(requester=friend_user, requestee=current_user, question=question)
        current_user.friends.add(friend_user)
        adoor_received_response_request = ResponseRequest.objects.create(requester=current_user,
                                                                         requestee=user_adoor, question=question)

        # POST - send response request to non-friends
        data = {"requester_id": current_user.id, "requestee_id": friend_user.id, "question_id": question.id}
        with self.login(username=current_user.username, password='password'):
            response = self.post('response-request-create', data=data)
            self.assertEqual(response.status_code, 201)

        qid = adoor_received_response_request.question.id
        rid = user_adoor.id
        question_last_id = Question.objects.last().id

        # DELETE - actor
        with self.login(username=current_user.username, password='password'):
            response = self.delete(self.reverse('response-request-destroy',
                                                qid=question.id, rid=friend_user.id))
            self.assertEqual(response.status_code, 204)

        # GET - method not allowed
        with self.login(username=current_user.username, password='password'):
            response = self.get(self.reverse('response-request-destroy', qid=qid, rid=rid))
            self.assertEqual(response.status_code, 405)

        # PATCH - method not allowed
        with self.login(username=current_user.username, password='password'):
            response = self.patch(self.reverse('response-request-destroy', qid=qid, rid=rid))
            self.assertEqual(response.status_code, 405)
