from django.contrib.contenttypes.models import ContentType


def get_user_type():
    from django.contrib.auth import get_user_model
    User = get_user_model()
    return ContentType.objects.get_for_model(User)


def get_friend_request_type():
    from account.models import FriendRequest
    return ContentType.objects.get_for_model(FriendRequest)


def get_comment_type():
    from comment.models import Comment
    return ContentType.objects.get_for_model(Comment)


def get_like_type():
    from like.models import Like
    return ContentType.objects.get_for_model(Like)


def get_article_type():
    from feed.models import Article
    return ContentType.objects.get_for_model(Article)


def get_question_type():
    from feed.models import Question
    return ContentType.objects.get_for_model(Question)


def get_response_type():
    from feed.models import Response
    return ContentType.objects.get_for_model(Response)


def get_post_type():
    from feed.models import Post
    return ContentType.objects.get_for_model(Post)


def get_generic_relation_type(model):
    if model == 'Comment':
        return get_comment_type()
    elif model == 'Article':
        return get_article_type()
    elif model == 'Response':
        return get_response_type()
    elif model == 'Question':
        return get_question_type()
    else:
        return None


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
