from django.contrib.contenttypes.models import ContentType


def get_content_type(model_name):
    if model_name == 'comment':
        from comment.models import Comment
        model = Comment
    elif model_name == 'like':
        from like.models import Like
        model = Like
    elif model_name == 'article':
        from feed.models import Article
        model = Article
    elif model_name == 'question':
        from feed.models import Question
        model = Question
    elif model_name == 'response':
        from feed.models import Response
        model = Response
    elif model_name == 'post':
        from feed.models import Post
        model = Post
    else:
        model = None
    return ContentType.objects.get_for_model(model)
