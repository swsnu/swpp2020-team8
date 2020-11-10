from faker import Faker
import random
from django.contrib.auth import get_user_model
from adoorback.utils.content_types import get_content_type
from feed.models import Article, Response, Question, Post
from comment.models import Comment
from like.models import Like
import logging
import sys


DEBUG = True


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
        admin = User.objects.create_superuser(username='adoor', email='adoor.team@gmail.com', password='adoor2020:)')
    logging.info("Superuser created!") if DEBUG else None

    # Seed Article/AdminQuestion/CustomQuestionPost
    users = User.objects.all()
    for _ in range(n):
        user = random.choice(users)
        Article.objects.create(author=user, content=faker.catch_phrase())
        Question.objects.create(author=admin, is_admin_question=True, content=faker.bs())
        Question.objects.create(author=user, is_admin_question=False, content=faker.word())
    logging.info(f"{Article.objects.all().count()} Article(s) created!") if DEBUG else None
    logging.info(f"{Question.objects.all().filter(is_admin_question=True).count()} Admin Question(s) created!") if DEBUG else None
    logging.info(f"{Question.objects.all().filter(is_admin_question=False).count()} Custom Question(s) created!") if DEBUG else None

    # Seed Response
    questions = Question.objects.all()
    for _ in range(n):
        question = random.choice(questions)
        Response.objects.create(author=user, question=question)
    logging.info(f"{Response.objects.all().count()} Response(s) created!") if DEBUG else None

    # Seed Comment (target=Feed)
    articles = Article.objects.all()
    questions = Question.objects.all()
    responses = Response.objects.all()
    for _ in range(n):
        user = random.choice(users)
        article = random.choice(articles)
        question = random.choice(questions)
        response = random.choice(responses)
        Comment.objects.create(author=user, target=article, content=faker.catch_phrase(), is_private=_ % 2)
        Comment.objects.create(author=user, target=question, content=faker.catch_phrase(), is_private=_ % 2)
        Comment.objects.create(author=user, target=response, content=faker.catch_phrase(), is_private=_ % 2)
    logging.info(f"{Comment.objects.all().count()} Comment(s) created!") if DEBUG else None

    # Seed Reply Comment (target=Comment)
    comment_model = get_content_type("comment")
    comments = Comment.objects.all()
    for _ in range(n):
        user = random.choice(users)
        comment = random.choice(comments)
        Comment.objects.create(author=user, target=comment, content=faker.catch_phrase(), is_private=comment.is_private)
    logging.info(f"{Comment.objects.all().filter(content_type=comment_model).count()} Repl(ies) created!") if DEBUG else None

    # Seed Like
    replies = Comment.objects.replies_only()
    for _ in range(n):
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
    comments = Comment.objects.all()
    posts = Post.objects.all()
    for user in User.objects.all():
        Article.objects.create(author=user, content=faker.catch_phrase()) \
            if user.article_set.all().count() == 0 else None
        Question.objects.create(author=user, content=faker.catch_phrase(), is_admin_question=False) \
            if user.question_set.all().count() == 0 else None
        Response.objects.create(author=user, question=random.choice(questions)) \
            if user.response_set.all().count() == 0 else None
        Comment.objects.create(author=user, content=faker.catch_phrase(), target=random.choice(posts)) \
            if Comment.objects.comments_only().filter(author=user).count() == 0 else None
        Comment.objects.create(author=user, content=faker.catch_phrase(), target=random.choice(comments)) \
            if Comment.objects.replies_only().filter(author=user).count() == 0 else None
        Like.objects.create(user=user, target=random.choice(posts)) \
            if Like.objects.feed_likes_only().filter(user=user).count() == 0 else None
        Like.objects.create(user=user, target=random.choice(comments)) \
            if Like.objects.comment_likes_only().filter(user=user).count() == 0 else None
