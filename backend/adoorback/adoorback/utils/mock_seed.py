import random
import logging
import sys
import pandas as pd

from django.utils import timezone
from django.contrib.auth import get_user_model
from faker import Faker

from adoorback.utils.content_types import get_content_type
from feed.models import Article, Response, Question, Post
from comment.models import Comment
from like.models import Like


DEBUG = False


def set_question_seed():
    df = pd.read_csv('adoorback/assets/questions.csv')

    User = get_user_model()
    admin = User.objects.get(username='adoor')

    for i in df.index:
        content = df.at[i, 'content']
        Question.objects.create(author=admin, is_admin_question=True, content=content)


def set_seed(n):
    if DEBUG:
        logging.basicConfig(stream=sys.stderr, level=logging.ERROR)

    User = get_user_model()
    faker = Faker()

    # Seed User
    for _ in range(2):
        User.objects.create_user(username=faker.user_name(), email=faker.email(), password=faker.password(length=12))
    logging.info(f"{User.objects.all().count()} User(s) created!") if DEBUG else None

    # Seed Superuser
    if User.objects.all().count() == 2:
        User.objects.create_superuser(username='adoor', email='adoor.team@gmail.com', password='adoor2020:)')
    User.objects.get(username='adoor')
    logging.info("Superuser created!") if DEBUG else None

    # Seed Article/AdminQuestion/CustomQuestionPost
    users = User.objects.all()
    for _ in range(n//5):
        user = random.choice(users)
        Article.objects.create(author=user,
                               content=faker.catch_phrase(),
                               share_with_friends=random.choice([True, False]),
                               share_anonymously=random.choice([True, False]))
        Question.objects.create(author=user, is_admin_question=True, content=faker.word())
        Question.objects.create(author=user, is_admin_question=False, content=faker.word())
    logging.info(f"{Article.objects.all().count()} Article(s) created!") if DEBUG else None
    logging.info(f"{Question.objects.all().count()} Question(s) created!") \
        if DEBUG else None
    if n > 10:
        set_question_seed()

    # Select Daily Questions
    daily_questions = Question.objects.all().filter(selected_date__isnull=True).order_by('?')[:30]
    for question in daily_questions:
        question.selected_date = timezone.now()
        question.save()

    # Seed Response
    for _ in range(n):
        question = random.choice(daily_questions)
        Response.objects.create(author=user, content=faker.text(max_nb_chars=50), question=question,
                                share_with_friends=random.choice([True, False]),
                                share_anonymously=random.choice([True, False]))
    logging.info(f"{Response.objects.all().count()} Response(s) created!") if DEBUG else None

    # Seed Comment (target=Feed)
    articles = Article.objects.all()
    questions = Question.objects.all()
    responses = Response.objects.all()
    for _ in range(n * 3):
        user = random.choice(users)
        article = random.choice(articles)
        response = random.choice(responses)
        Comment.objects.create(author=user, target=article, content=faker.catch_phrase(), is_private=_ % 2)
        Comment.objects.create(author=user, target=response, content=faker.catch_phrase(), is_private=_ % 2)
    logging.info(f"{Comment.objects.all().count()} Comment(s) created!") if DEBUG else None

    # Seed Reply Comment (target=Comment)
    comment_model = get_content_type("comment")
    comments = Comment.objects.all()
    for _ in range(n * 6):
        user = random.choice(users)
        comment = random.choice(comments)
        Comment.objects.create(author=user, target=comment,
                               content=faker.catch_phrase(), is_private=comment.is_private)
    logging.info(f"{Comment.objects.all().filter(content_type=comment_model).count()} Repl(ies) created!") \
        if DEBUG else None

    # Seed Like
    replies = Comment.objects.replies_only()
    for _ in range(n * 10):
        user = random.choice(users)
        article = random.choice(articles)
        question = random.choice(questions)
        response = random.choice(responses)
        comment = random.choice(comments)
        reply = random.choice(replies)
        Like.objects.create(user=user, target=article)
        Like.objects.create(user=user, target=question)
        Like.objects.create(user=user, target=response)
        Like.objects.create(user=user, target=comment)
        Like.objects.create(user=user, target=reply)
    logging.info(f"{Like.objects.all().count()} Like(s) created!") if DEBUG else None


def fill_data():
    User = get_user_model()
    faker = Faker()

    # Fill Empty Seed Data
    questions = Question.objects.all()
    articles = Article.objects.all()
    comments = Comment.objects.all()
    posts = Post.objects.all()
    for user in User.objects.all():
        Article.objects.create(author=user, content=faker.catch_phrase()) \
            if user.article_set.all().count() == 0 else None
        Question.objects.create(author=user, content=faker.catch_phrase(), is_admin_question=False) \
            if user.question_set.all().count() == 0 else None
        Response.objects.create(author=user, content=faker.catch_phrase(), question=random.choice(questions)) \
            if user.response_set.all().count() == 0 else None
        Comment.objects.create(author=user, content=faker.catch_phrase(), target=random.choice(articles)) \
            if Comment.objects.comments_only().filter(author=user).count() == 0 else None
        Comment.objects.create(author=user, content=faker.catch_phrase(), target=random.choice(comments)) \
            if Comment.objects.replies_only().filter(author=user).count() == 0 else None
        Like.objects.create(user=user, target=random.choice(posts)) \
            if Like.objects.feed_likes_only().filter(user=user).count() == 0 else None
        Like.objects.create(user=user, target=random.choice(comments)) \
            if Like.objects.comment_likes_only().filter(user=user).count() == 0 else None
