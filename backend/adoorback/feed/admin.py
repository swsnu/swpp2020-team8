from django.contrib import admin
from .models import Article, Response, Question, ResponseRequest


admin.site.register(Article)
admin.site.register(Response)
admin.site.register(Question)
admin.site.register(ResponseRequest)
