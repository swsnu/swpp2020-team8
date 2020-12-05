import random

from locust import HttpUser, task, between


class WebsiteUser(HttpUser):
    wait_time = between(5, 15)
    host = 'http://localhost:8000'

    def on_start(self):
        response = self.client.post('/api/user/token/',
                                    json={"username": "adoor_user", "password": "adoor2020:)"})
        csrf_token = response.cookies['csrftoken']
        jwt_token = response.json()['access']

        response = self.client.post('/api/user/login/',
                                    json={"username": "adoor_user", "password": "adoor2020:)"},
                                    headers={"X-CSRFToken": csrf_token,
                                             "Authorization": "Bearer {}".format(jwt_token)})
        if response.status_code != 204:
            print(str(response.status_code) + " login")

    @task(1)
    def get_profile(self):
        response = self.client.get("/api/user/me/")
        if response != 200:
            print(str(response.status_code) + " get profile")

    @task(30)
    def get_friend_feed(self):
        response = self.client.get("/api/feed/friend/")
        if response != 200:
            print(str(response.status_code) + " get friend feed")

    @task(20)
    def get_anonymous_feed(self):
        response = self.client.get("/api/feed/anonymous/")
        if response != 200:
            print(str(response.status_code) + " get anonymous feed")

    @task(10)
    def get_questions_feed(self):
        response = self.client.get("/api/feed/questions/")
        if response != 200:
            print(str(response.status_code) + " get questions feed")

    @task(15)
    def get_questions_detail(self):
        response = self.client.get(f"/api/feed/questions/{random.randint(1, 2000)}/")
        if response != 200:
            print(str(response.status_code) + " get questions feed")

    @task(20)
    def post_question_response(self):
        response = self.client.post("/api/feed/questions/",
                                    json={"content": "test content",
                                          "question_id": random.randint(1, 2000),
                                          "share_anonymously": random.choice([True, False])})
        if response != 200:
            print(str(response.status_code) + " get questions feed")

    def on_stop(self):
        response = self.client.get('/api/user/logout/')
        if response != 200:
            print(str(response.status_code) + " logout")
