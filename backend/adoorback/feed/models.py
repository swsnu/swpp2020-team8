import datetime
from django.db import models
from django.db.models.signals import post_save, post_delete, pre_delete
from django.dispatch import receiver
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.auth import get_user_model

from comment.models import Comment
from like.models import Like
from adoorback.models import AdoorModel, AdoorTimestampedModel
from notification.models import Notification

User = get_user_model()


class Article(AdoorModel):
    author = models.ForeignKey(User, related_name='article_set', on_delete=models.CASCADE)
    share_with_friends = models.BooleanField(default=True)
    share_anonymously = models.BooleanField(default=True)

    article_comments = GenericRelation(Comment)
    article_likes = GenericRelation(Like)

    article_targetted_notis = GenericRelation(Notification,
                                              content_type_field='target_type',
                                              object_id_field='target_id')
    article_originated_notis = GenericRelation(Notification,
                                               content_type_field='origin_type',
                                               object_id_field='origin_id')

    @property
    def type(self):
        return self.__class__.__name__

    @property
    def liked_user_ids(self):
        return self.article_likes.values_list('user_id', flat=True)


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
                                               content_type_field='target_type',
                                               object_id_field='target_id')
    question_originated_notis = GenericRelation(Notification,
                                                content_type_field='origin_type',
                                                object_id_field='origin_id')

    objects = QuestionManager()

    @property
    def type(self):
        return self.__class__.__name__

    @property
    def liked_user_ids(self):
        return self.question_likes.values_list('user_id', flat=True)

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
                                               content_type_field='target_type',
                                               object_id_field='target_id')
    response_originated_notis = GenericRelation(Notification,
                                                content_type_field='origin_type',
                                                object_id_field='origin_id')

    @property
    def type(self):
        return self.__class__.__name__

    @property
    def liked_user_ids(self):
        return self.response_likes.values_list('user_id', flat=True)


class ResponseRequest(AdoorTimestampedModel):
    requester = models.ForeignKey(User, related_name='sent_response_request_set', on_delete=models.CASCADE)
    requestee = models.ForeignKey(User, related_name='received_response_request_set', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    response_request_targetted_notis = GenericRelation('notification.Notification',
                                                       content_type_field='target_type',
                                                       object_id_field='target_id')
    response_request_originated_notis = GenericRelation('notification.Notification',
                                                        content_type_field='origin_type',
                                                        object_id_field='origin_id')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['requester', 'requestee', 'question'], name='unique_response_request'),
        ]

    def __str__(self):
        return f'{self.requester} sent ({self.question}) to {self.requestee}'

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
def create_post(sender, instance, **kwargs):
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
def delete_post(sender, instance, **kwargs):
    if sender == User:
        Post.objects.filter(author_id=instance.id).delete()
    else:
        Post.objects.get(content_type=ContentType.objects.get_for_model(sender),
                         object_id=instance.id).delete()


@receiver(post_save, sender=ResponseRequest)
def create_response_request_noti(instance, **kwargs):
    target = instance
    origin = instance.question
    requester = instance.requester
    requestee = instance.requestee
    message = f'똑똑똑~ {requester.username}님으로부터 질문이 왔어요!'
    redirect_url = f'/questions/{origin.id}'
    Notification.objects.create(actor=requester, user=requestee,
                                origin=origin, target=target,
                                message=message, redirect_url=redirect_url)


@receiver(post_save, sender=Response)
def create_request_answered_noti(instance, created, **kwargs):
    if not created:  # response edit만 해준 경우
        return

    author_id = instance.author.id
    question_id = instance.question.id
    target = instance
    origin = instance
    actor = instance.author
    related_requests = ResponseRequest.objects.filter(
        requestee_id=author_id, question_id=question_id)
    redirect_url = f'/questions/{question_id}'

    for request in related_requests:
        user = request.requester
        message = f'{actor.username}님이 회원님이 보낸 질문에 답했습니다.'
        Notification.objects.create(actor=actor, user=user,
                                    origin=origin, target=target,
                                    message=message, redirect_url=redirect_url)


@receiver(post_save, sender=Response)
def delete_response_request(instance, created, **kwargs):
    if not created:
        return

    try:
        response_requests = ResponseRequest.objects.filter(requestee_id=instance.author.id,
                                                           question=instance.question)
    except ResponseRequest.DoesNotExist:
        return
    response_requests.delete()


@receiver(pre_delete, sender=Question)
def protect_question_noti(instance, **kwargs):
    # response request에 대한 response 보냈을 때 발생하는 노티, like/comment로 발생하는 노티 모두 보호
    for noti in Notification.objects.visible_only().filter(redirect_url=f'/questions/{instance.id}'):
        noti.target_type = None
        noti.origin_type = None
        noti.save()


@receiver(pre_delete, sender=Response)
def protect_response_noti(instance, **kwargs):
    # comment, like로 인한 노티, response request 답변으로 인한 노티 모두 보호
    for noti in Notification.objects.visible_only().filter(redirect_url=f'/responses/{instance.id}'):
        noti.target_type = None
        noti.origin_type = None
        noti.save()


@receiver(pre_delete, sender=Article)
def protect_article_noti(instance, **kwargs):
    # comment, like로 인한 노티 모두 보호
    for noti in Notification.objects.visible_only().filter(redirect_url=f'/articles/{instance.id}'):
        noti.target_type = None
        noti.origin_type = None
        noti.save()
