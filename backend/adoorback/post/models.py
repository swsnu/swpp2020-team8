from django.db import models
from django.contrib.auth.models import User
from ..question.models import Question


class Post(models.Model):
    class Meta:
        abstract = True

    id = models.AutoField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)

    def __str__(self):
        return self.content


class Article(Post):
    pass


class Response(Post):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)