import requests


ENDPOINT = "http://localhost:8000"


def test_can_put_and_get_dmsmail():
    create_response = create_dmsmail()
    assert create_response.status_code == 200


def create_dmsmail():
    return requests.put(f"{ENDPOINT}/create-dmsmail")
