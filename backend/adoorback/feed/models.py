from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from polymorphic.models import PolymorphicModel
from polymorphic.showfields import ShowFieldType
from django.contrib.contenttypes.fields import GenericRelation
from comment.models import Comment
from like.models import Like


User = get_user_model()


def non_polymorphic_cascade(collector, field, sub_objs, using):
    return models.CASCADE(collector, field, sub_objs.non_polymorphic(), using)


# Polymorphic filtering reference: https://django-polymorphic.readthedocs.io/en/stable/advanced.html
class Feed(PolymorphicModel, ShowFieldType):
    author = models.ForeignKey(User, related_name='feed_set', on_delete=non_polymorphic_cascade)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    feed_comments = GenericRelation(Comment)
    feed_likes = GenericRelation(Like)

    def __str__(self):
        return self.content


class Article(Feed):
    article_comments = GenericRelation(Comment)
    article_likes = GenericRelation(Like)


class Response(Feed):
    content_type = models.ForeignKey(ContentType, related_name='response_set', on_delete=non_polymorphic_cascade)
    object_id = models.IntegerField(blank=True, null=True)
    target = GenericForeignKey('content_type', 'object_id')

    response_comments = GenericRelation(Comment)
    response_likes = GenericRelation(Like)


class Question(Feed):
    selected_date = models.DateTimeField(null=True, blank=True)
    response = GenericRelation(Response)

    question_comments = GenericRelation(Comment)
    question_likes = GenericRelation(Like)


class AdminQuestion(Question):
    admin_question_comments = GenericRelation(Comment)
    admin_question_likes = GenericRelation(Like)


class CustomQuestionPost(Question):
    custom_question_comments = GenericRelation(Comment)
    custom_question_likes = GenericRelation(Like)
