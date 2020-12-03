from .base import *

DEBUG = True

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'adoor',
        'USER': 'adoor',
        'PASSWORD': 'adoor2020:)',
        'HOST': 'localhost',
        'POST': '',
    },
}

sentry_sdk.init(
    dsn="https://3525cb8e094e49fe9973fd92ccbf456b@o486285.ingest.sentry.io/5543025",
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.2,

    send_default_pii=True
)
