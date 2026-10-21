import pytest
from fastapi.testclient import TestClient
from app import main

@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(main, "DB_PATH", str(tmp_path / "test.db"))
    monkeypatch.delenv("TAVILY_API_KEY", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    with TestClient(main.app) as c:
        yield c

def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}

def test_research_without_keys_and_history(client):
    response = client.post("/api/research", json={"question": "How does retrieval augmented generation work?"})
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "unconfigured"
    assert data["sources"] == []
    assert client.get("/api/reports").json()[0]["id"] == data["id"]
    assert client.get(f"/api/reports/{data['id']}").json() == data

def test_validation_and_missing_report(client):
    assert client.post("/api/research", json={"question": "short"}).status_code == 422
    assert client.post("/api/research", json={"question": "A suitable research question", "max_sources": 100}).status_code == 422
    assert client.get("/api/reports/not-here").status_code == 404

def test_url_filter():
    assert main.valid_public_http_url("https://example.org/paper")
    assert not main.valid_public_http_url("file:///etc/passwd")
    assert not main.valid_public_http_url("http://localhost/admin")
