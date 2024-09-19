import requests
import random
import string


ENDPOINT = "http://localhost:8000"


def test_create_user():
    email = f"{''.join(random.choices(string.ascii_letters, k=10))}@test.com"
    pw = ''.join(random.choices(string.ascii_letters, k=8))
    body = {"email": email, "password": pw}
    resp = requests.post(f"{ENDPOINT}/users/", json=body)
    assert resp.status_code == 200


def test_no_duplicate_emails():
    email = "thisisnotauniqueemail@test.com"
    pw = "whatever"
    body = {"email": email, "password": pw}
    try:
        resp = requests.post(f"{ENDPOINT}/users/", json=body)
        if resp.status_code == 400:
            pass
    finally:
        resp = requests.post(f"{ENDPOINT}/users", json=body)
        assert resp.status_code == 400


def test_delete_user():
    email = f"{''.join(random.choices(string.ascii_letters, k=10))}@test.com"
    pw = ''.join(random.choices(string.ascii_letters, k=8))
    body = {"email": email, "password": pw}
    resp = requests.post(f"{ENDPOINT}/users/", json=body)
    assert resp.status_code == 200
    user_id = resp.json().get("id")
    delete_resp = requests.delete(f"{ENDPOINT}/users/{user_id}")
    assert delete_resp.status_code == 200
