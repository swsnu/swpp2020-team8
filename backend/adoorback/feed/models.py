from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation
from comment.models import Comment
from like.models import Like
from django.contrib.auth import get_user_model
from adoorback.models import AdoorModel


User = get_user_model()


class Article(AdoorModel):
    author = models.ForeignKey(User, related_name='article_set', on_delete=models.CASCADE)

    article_comments = GenericRelation(Comment)
    article_likes = GenericRelation(Like)


class QuestionManager(models.Manager):
    use_for_related_fields = True

    def admin_questions_only(self, **kwargs):
        return self.filter(is_admin_question=True, **kwargs)

    def custom_questions_only(self, **kwargs):
        return self.filter(is_admin_question=False, **kwargs)


class Question(AdoorModel):
    author = models.ForeignKey(User, related_name='question_set', on_delete=models.CASCADE)

    selected_date = models.DateTimeField(null=True)
    is_admin_question = models.BooleanField()

    question_comments = GenericRelation(Comment)
    question_likes = GenericRelation(Like)

    objects = QuestionManager()


class Response(AdoorModel):
    author = models.ForeignKey(User, related_name='response_set', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, related_name='response_set', on_delete=models.CASCADE)

    response_comments = GenericRelation(Comment)
    response_likes = GenericRelation(Like)


class Post(AdoorModel):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.IntegerField()
    target = GenericForeignKey('content_type', 'object_id')

    class Meta:
        ordering = ['-created_at']


@receiver(post_save, sender=Question)
@receiver(post_save, sender=Response)
@receiver(post_save, sender=Article)
def create_post(sender, **kwargs):
    instance = kwargs['instance']
    content_type = ContentType.objects.get_for_model(instance)
    try:
        post = Post.objects.get(content_type=content_type, object_id=instance.id)
    except Post.DoesNotExist:
        post = Post(content_type=content_type, object_id=instance.id)
    post.content = instance.content
    post.created_at = instance.created_at
    post.updated_at = instance.updated_at
    post.save()


@receiver(post_delete, sender=Question)
@receiver(post_delete, sender=Response)
@receiver(post_delete, sender=Article)
def delete_post(sender, **kwargs):
    instance = kwargs['instance']
    post = Post.objects.get(content_type=ContentType.objects.get_for_model(instance), object_id=instance.id)
    post.delete()
