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
pip install -r requirements.txt
python manage.py makemigrations account feed comment like
python manage.py migrate
# for seed data
python manage.py shell
from adoorback.utils.mock_seed import set_seed
set_seed()
python manage.py runserver
```

### Test
