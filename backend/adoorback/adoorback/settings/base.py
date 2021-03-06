"""
Django settings for adoorback project.

Generated by 'django-admin startproject' using Django 3.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

from pathlib import Path
import datetime
import os.path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '((5+vsn)pefc7()9_x2oud)po=@0=@gf0=8j)lrk*(*sy47c+='

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 15,
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
}

JWT_AUTH = {
    'JWT_VERIFY': True,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=30000),
    'JWT_AUTH_HEADER_PREFIX': 'Bearer',
}


CORS_ORIGIN_WHITELIST = [
    "https://develop.d3t1tnno5uz3sa.amplifyapp.com",
    "http://localhost:8000",
]

BASE_URL = 'http://localhost:8000'

# Application definition

INSTALLED_APPS = [
    'feed.apps.FeedConfig',
    'like.apps.LikeConfig',
    'comment.apps.CommentConfig',
    'notification.apps.NotificationConfig',
    'account.apps.AccountConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework',
    'polymorphic',
    'admin_honeypot',
    'django_cron',
    'corsheaders',
    'import_export',
    'trackstats',
]

SITE_ID = 1

AUTH_USER_MODEL = 'account.User'

LOGIN_REDIRECT_URL = '/api/user/'

CRON_CLASSES = [
    "feed.cron.DailyQuestionCronJob",
    "feed.cron.RankQuestionsCronJob",
    "account.cron.SendSelectQuestionsNotiCronJob",
    "account.cron.SendAddFriendsNotiCronJob",
]

# reference: https://github.com/jazzband/django-redis
# CACHES = {
#     "default": {
#         "BACKEND": "django_redis.cache.RedisCache",
#         "LOCATION": "redis://127.0.0.1:6379/1",
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient",
#         }
#     }
# }

CACHES = {
   'default': {
       'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
       'LOCATION': 'unique-snowflake',
       'OPTIONS': {
           'CLIENT_CLASS': 'django_redis.client.DefaultClient',
       }
   }
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'adoorback.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'adoorback.wsgi.application'

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'ko-KR'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'adoorback', 'static'),
)

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
