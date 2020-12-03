import sentry_sdk

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from rest_framework import status
from rest_framework.views import exception_handler


def validate_notification_message(message):
    if message not in ['sent friend request to',
                       'received friend request from',
                       'refused friend request of',
                       'accepted friend request of']:
        raise ValidationError(
            _('%(message)s is not a valid message'),
            params={'message': message},
        )


def adoor_exception_handler(e, context):
    response = exception_handler(e, context)
    if response.status_code in [status.HTTP_400_BAD_REQUEST,
                                status.HTTP_401_UNAUTHORIZED,
                                status.HTTP_405_METHOD_NOT_ALLOWED,
                                status.HTTP_404_NOT_FOUND,
                                status.HTTP_403_FORBIDDEN]:
        sentry_sdk.capture_exception(e)
    return response
