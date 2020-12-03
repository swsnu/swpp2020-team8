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
