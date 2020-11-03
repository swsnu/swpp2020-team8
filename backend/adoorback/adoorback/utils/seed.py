from faker import Faker
import random
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from feed.models import Feed, Article, AdminQuestion, CustomQuestionPost, Response, Question
from comment.models import Comment
from like.models import Like
import logging
import sys


DEBUG = True


def set_seed(n):
    if DEBUG:
        logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)

    User = get_user_model()
    faker = Faker()

    # Seed User
    for _ in range(3):
        User.objects.create_user(username=faker.user_name(), email=faker.email(), password=faker.password(length=12))
    logging.info(f"{User.objects.all().count()} User(s) created!") if DEBUG else None

    # Seed Superuser
    admin = User.objects.get(id=1)
    admin.is_superuser = True
    admin.save()
    logging.info("Superuser created!") if DEBUG else None

    # Seed Article/AdminQuestion/CustomQuestionPost
    users = User.objects.all()
    for _ in range(n):
        user = random.choice(users)
        Article.objects.create(author=user, content=faker.catch_phrase())
        AdminQuestion.objects.create(author=admin, content=faker.bs())
        CustomQuestionPost.objects.create(author=user, content=faker.word())
    logging.info(f"{Article.objects.all().count()} Article(s) created!") if DEBUG else None
    logging.info(f"{AdminQuestion.objects.all().count()} AdminQuestion(s) created!") if DEBUG else None
    logging.info(f"{CustomQuestionPost.objects.all().count()} CustomQuestionPost(s) created!") if DEBUG else None

    # Seed Response
    questions = Question.objects.all()
    for _ in range(n):
        target = random.choice(questions)
        Response.objects.create(author=user, content=faker.text(max_nb_chars=50), target=target)
    logging.info(f"{Response.objects.all().count()} Response(s) created!") if DEBUG else None

    # Seed Comment (target=Feed)
    posts = Feed.objects.all().not_instance_of(Question)
    questions = Question.objects.all()

    for _ in range(n):
        user = random.choice(users)
        post = random.choice(posts)
        question = random.choice(questions)
        Comment.objects.create(author=user, target=post, content=faker.catch_phrase(), is_private=_ % 2)
        Comment.objects.create(author=user, target=question, content=faker.catch_phrase(), is_private=_ % 2)
    logging.info(f"{Comment.objects.all().count()} Comment(s) created!") if DEBUG else None

    # Seed Reply Comment (target=Comment)
    comment_model = ContentType.objects.get_for_model(Comment)
    comments = Comment.objects.all()
    for _ in range(n):
        user = random.choice(users)
        comment = random.choice(comments)
        Comment.objects.create(author=user, target=comment, content=faker.catch_phrase(), is_private=comment.is_private)
    logging.info(f"{Comment.objects.all().filter(content_type=comment_model).count()} Repl(ies) created!") if DEBUG else None

    # Seed Like
    feed_model = ContentType.objects.get_for_model(Feed)
    replies = Comment.objects.all().filter(content_type=comment_model)
    for _ in range(n):
        user = random.choice(users)
        post = random.choice(posts)
        question = random.choice(questions)
        comment = random.choice(comments)
        reply = random.choice(replies)
        Like.objects.create(user=user, target=post)
        Like.objects.create(user=user, target=question)
        Like.objects.create(user=user, target=comment)
        Like.objects.create(user=user, target=reply)
    logging.info(f"{Like.objects.all().count()} Like(s) created!") if DEBUG else None
