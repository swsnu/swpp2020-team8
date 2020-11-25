import datetime
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.auth import get_user_model

from comment.models import Comment
from like.models import Like
from notification.models import Notification
from adoorback.models import AdoorModel


User = get_user_model()


class Article(AdoorModel):
    author = models.ForeignKey(User, related_name='article_set', on_delete=models.CASCADE)
    share_with_friends = models.BooleanField(default=True)
    share_anonymously = models.BooleanField(default=True)

    article_comments = GenericRelation(Comment)
    article_likes = GenericRelation(Like)
    article_targetted_notis = GenericRelation(Notification,
        content_type_field='target_type', object_id_field='target_id')
    article_originated_notis = GenericRelation(Notification,
        content_type_field='origin_type', object_id_field='origin_id')

    @property
    def type(self):
        return self.__class__.__name__


class QuestionManager(models.Manager):

    def admin_questions_only(self, **kwargs):
        return self.filter(is_admin_question=True, **kwargs)

    def custom_questions_only(self, **kwargs):
        return self.filter(is_admin_question=False, **kwargs)

    def daily_questions(self, **kwargs):
        return self.filter(selected_date__date=datetime.date.today(), **kwargs)


class Question(AdoorModel):
    author = models.ForeignKey(User, related_name='question_set', on_delete=models.CASCADE)

    selected_date = models.DateTimeField(null=True)
    is_admin_question = models.BooleanField(default=False)

    question_comments = GenericRelation(Comment)
    question_likes = GenericRelation(Like)
    question_targetted_notis = GenericRelation(Notification,
        content_type_field='target_type', object_id_field='target_id')
    question_originated_notis = GenericRelation(Notification,
        content_type_field='origin_type', object_id_field='origin_id')

    objects = QuestionManager()

    @property
    def type(self):
        return self.__class__.__name__

    class Meta:
        base_manager_name = 'objects'


class Response(AdoorModel):
    author = models.ForeignKey(User, related_name='response_set', on_delete=models.CASCADE)
    share_with_friends = models.BooleanField(default=True)
    share_anonymously = models.BooleanField(default=True)
    question = models.ForeignKey(Question, related_name='response_set', on_delete=models.CASCADE)

    response_comments = GenericRelation(Comment)
    response_likes = GenericRelation(Like)
    response_targetted_notis = GenericRelation(Notification,
        content_type_field='target_type', object_id_field='target_id')
    response_originated_notis = GenericRelation(Notification,
        content_type_field='origin_type', object_id_field='origin_id')

    @property
    def type(self):
        return self.__class__.__name__


class PostManager(models.Manager):

    def friend_posts_only(self, **kwargs):
        return self.filter(share_with_friends=True, **kwargs)

    def anonymous_posts_only(self, **kwargs):
        return self.filter(share_anonymously=True, **kwargs)


class Post(AdoorModel):
    author_id = models.IntegerField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.IntegerField()
    target = GenericForeignKey('content_type', 'object_id')
    share_with_friends = models.BooleanField(default=True)
    share_anonymously = models.BooleanField(default=True)

    objects = PostManager()

    class Meta:
        ordering = ['-created_at']
        base_manager_name = 'objects'


@receiver(post_save, sender=Question)
@receiver(post_save, sender=Response)
@receiver(post_save, sender=Article)
def create_post(sender, **kwargs):
    instance = kwargs['instance']
    content_type = ContentType.objects.get_for_model(sender)
    try:
        post = Post.objects.get(content_type=content_type, object_id=instance.id)
    except Post.DoesNotExist:
        post = Post(content_type=content_type, object_id=instance.id)
    if instance.type != 'Question':
        post.share_with_friends = instance.share_with_friends
        post.share_anonymously = instance.share_anonymously
    post.author_id = instance.author.id
    post.content = instance.content
    post.created_at = instance.created_at
    post.updated_at = instance.updated_at
    post.save()


@receiver(post_delete, sender=User)
@receiver(post_delete, sender=Question)
@receiver(post_delete, sender=Response)
@receiver(post_delete, sender=Article)
def delete_post(sender, **kwargs):
    instance = kwargs['instance']
    if sender == User:
        Post.objects.filter(author_id=instance.id).delete()
    else:
        Post.objects.get(content_type=ContentType.objects.get_for_model(sender), object_id=instance.id).delete()
