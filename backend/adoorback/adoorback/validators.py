from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_notification_message(message):
    if message not in ['sent friend request to',
                       'received friend request from',
                       'refused friend request of',
                       'accepted friend request of']:
        raise ValidationError(
            _('%(message)s is not a valid message'),
            params={'message': message},
        )
