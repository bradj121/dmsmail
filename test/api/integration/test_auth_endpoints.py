import requests
import time

import pytest

from datetime import datetime, timedelta


ENDPOINT = "http://localhost:8000"


@pytest.fixture(scope="module")
def auth_test_user():
    body = {"email": "test@test.com", "password": "password"}
    resp = requests.post(f"{ENDPOINT}/api/auth/signin", json=body)
    if resp.ok:
        return resp.json()


@pytest.fixture
def policy_for_user(auth_test_user):
    headers = {"Accept": "application/json", "Authorization": f"Bearer {auth_test_user.get('token')}"}
    get_resp = requests.get(f"{ENDPOINT}/api/auth/users/me/policies", headers=headers)
    policies = get_resp.json()
    if len(policies) == 0:
        headers["Content-Type"] = "application/json"
        body = {
            "recipients": "abc@123.com",
            "subject": "this is a subject",
            "body": "this is the message body",
            "expiration_date": (datetime.today() + timedelta(days=1)).strftime("%m/%d/%Y"),
            "attachments": "",
            "status": "active",
        }
        create_resp = requests.post(f"{ENDPOINT}/api/auth/users/me/policies", headers=headers, json=body)
        return create_resp.json()
    else:
        return policies[0]


def test_get_user(auth_test_user):
    headers = {"Accept": "application/json", "Authorization": f"Bearer {auth_test_user.get('token')}"}
    resp = requests.get(f"{ENDPOINT}/api/auth/users/me", headers=headers)
    assert resp.ok


def test_create_policy(auth_test_user):
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {auth_test_user.get('token')}",
        "Content-Type": "application/json",
    }
    body = {
        "recipients": "abc@123.com",
        "subject": "this is a subject",
        "body": "this is the message body",
        "expiration_date": (datetime.today() + timedelta(days=1)).strftime("%m/%d/%Y"),
        "attachments": "",
        "status": "active",
    }
    resp = requests.post(f"{ENDPOINT}/api/auth/users/me/policies", headers=headers, json=body)

    assert resp.ok

    response_body = resp.json()

    assert response_body.get('recipients') == body.get('recipients')


def test_update_policy(auth_test_user, policy_for_user):
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {auth_test_user.get('token')}",
        "Content-Type": "application/json",
    }
    del policy_for_user['sender_id']
    update_time = time.time()

    new_subject = f"updated at {update_time}"
    policy_for_user["subject"] = new_subject

    resp = requests.put(f"{ENDPOINT}/api/auth/users/me/policies", headers=headers, json=policy_for_user)

    resp_body = resp.json()

    assert str(update_time) in resp_body.get("subject")


def test_delete_policy(auth_test_user, policy_for_user):
    headers = {"Accept": "application/json", "Authorization": f"Bearer {auth_test_user.get('token')}"}

    resp = requests.delete(f"{ENDPOINT}/api/auth/users/me/policies/{policy_for_user.get('id')}", headers=headers)

    assert resp.ok

    resp = requests.get(f"{ENDPOINT}/api/auth/users/me", headers=headers)

    policies = resp.json().get("policies", [])

    assert not any(policy['id'] == policy_for_user.get('id') for policy in policies)
