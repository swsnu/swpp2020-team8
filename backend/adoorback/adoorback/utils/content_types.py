from django.contrib.contenttypes.models import ContentType


def get_content_type(model_name):
    if model_name == 'Comment':
        from comment.models import Comment
        model = Comment
    elif model_name == 'Like':
        from like.models import Like
        model = Like
    elif model_name == 'Article':
        from feed.models import Article
        model = Article
    elif model_name == 'Question':
        from feed.models import Question
        model = Question
    elif model_name == 'Response':
        from feed.models import Response
        model = Response
    elif model_name == 'Post':
        from feed.models import Post
        model = Post
    else:
        model = None
    return ContentType.objects.get_for_model(model)

def get_korean_type_name(model_name):
    if model_name == 'Comment':
        result = '댓글'
    elif model_name == 'Like':
        result = '좋아요'
    elif model_name == 'Article':
        result = '게시물'
    elif model_name == 'Question':
        result = '질문'
    elif model_name == 'Response':
        result = '답변'
    elif model_name == 'Post':
        result = '게시물'
    else:
        result = ''
    return result