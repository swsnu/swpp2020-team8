from locust import HttpUser, task, between


class WebsiteUser(HttpUser):
    wait_time = between(5, 15)
    host = 'http://localhost:8000'

    def on_start(self):
        response = self.client.post('/api/user/token/',
                                    data={"username": "adoor_user", "password": "adoor2020:)"})
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

    @task(1)
    def get_friend_feed(self):
        response = self.client.get("/api/feed/friend/")
        if response != 200:
            print(str(response.status_code) + " get friend feed")

    def on_stop(self):
        response = self.client.get('/api/user/logout/')
        if response != 200:
            print(str(response.status_code) + " logout")
