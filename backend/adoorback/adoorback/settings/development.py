from .base import *

DEBUG = True

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


CORS_ALLOWED_ORIGINS = [
    "https://develop.d3t1tnno5uz3sa.amplifyapp.com",
    "http://localhost:3000"
]