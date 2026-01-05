import requests
import json

url = "http://localhost:8001/api/v1/users/"
payload = {
    "email": "script_test_user_new@example.com",
    "password": "ScriptPassword123!",
    "full_name": "Script Test User",
    "user_type": "PORTAL_ADMIN",
    "phone": "1122334455",
    "is_active": True
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
