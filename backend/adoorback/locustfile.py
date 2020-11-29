from locust import HttpUser, TaskSet


def get_token(self):
    self.client.post("/api/user/token/", {"username": "ellen_key", "password": "education"})


def login(self):
    self.client.post("/api/user/login/", {"username": "ellen_key", "password": "education"})


def get_profile(self):
    self.client.get("/api/user/me/")
    print("got profile")


def stop(self):
    self.interrupt()


class AdoorApiClientBehavior(TaskSet):
    tasks = {login: 1, get_profile: 1}

    def on_start(self):
        get_token(self)


class WebsiteUser(HttpUser):
    task_set = AdoorApiClientBehavior

    min_wait = 1000
    max_wait = 5000
