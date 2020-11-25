# swpp2020-team8

[![Build Status](https://travis-ci.org/swsnu/swpp2020-team8.svg?branch=master)](https://travis-ci.org/swsnu/swpp2020-team8)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2020-team8&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2020-team8)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2020-team8/badge.svg?branch=master)](https://coveralls.io/github/swsnu/swpp2020-team8?branch=master)

## Frontend

### Run
```
cd frontend
yarn install
yarn start
```

### Test
```
yarn test --coverage --watchAll=false
```

## Backend

### Run
```
cd backend/adoorback
rm -f tmp.db db.sqlite3
rm -r */migrations
pip install -r requirements.txt
python manage.py makemigrations account feed comment like notification
python manage.py migrate
# for seed data
python manage.py shell
from adoorback.utils.seed import set_seed
set_seed(20)
python manage.py runserver
```

### Test

```
rm -f tmp.db db.sqlite3
rm -r */migrations
pylint **/*.py --load-plugins pylint_django
python manage.py makemigrations account feed comment like notification
python manage.py migrate
coverage run --source=‘.’ --omit=‘/migrations/’,’adoorback/’,’manage.py’,‘/wsgi.py’,‘/asgi.py’,‘/utils/*’ ./manage.py test
coverage run --branch --source=‘.’ --omit=‘/migrations/’,’adoorback/’,’manage.py’,‘/wsgi.py’,‘/asgi.py’,‘/utils/*’ ./manage.py test
coverage report -m
```
