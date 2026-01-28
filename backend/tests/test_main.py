from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Todo Application API"}

def test_auth_routes_exist():
    # Test that auth routes exist (will return 422 for missing body, but route exists)
    response = client.post("/api/auth/signin")
    assert response.status_code in [422, 400]  # 422 for missing body, 400 for invalid data

    response = client.post("/api/auth/signup")
    assert response.status_code in [422, 400]  # 422 for missing body, 400 for invalid data

def test_tasks_routes_require_auth():
    # Test that tasks routes require authentication
    response = client.get("/api/tasks/")
    assert response.status_code == 401  # Unauthorized without token