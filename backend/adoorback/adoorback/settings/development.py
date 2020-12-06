import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from .base import *

DEBUG = False

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql_psycopg2',
#         'NAME': 'adoor',
#         'USER': 'adoor',
#         'PASSWORD': 'adoor2020:)',
#         'HOST': 'localhost',
#         'POST': '',
#     },
# }

sentry_sdk.init(
    dsn="https://3525cb8e094e49fe9973fd92ccbf456b@o486285.ingest.sentry.io/5543025",
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,

    send_default_pii=True
)

# ALLOWED_HOSTS = ['localhost', '127.0.0.1']
ALLOWED_HOSTS = ['ec2-54-237-96-51.compute-1.amazonaws.com']
