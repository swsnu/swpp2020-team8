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
    dsn="https://examplePublicKey@o0.ingest.sentry.io/0",
    integrations=[DjangoIntegration()],

    traces_sample_rate=0.2,

    send_default_pii=True
)
