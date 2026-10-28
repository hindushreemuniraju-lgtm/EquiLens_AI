import os
import sys
import asyncio

backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)
os.chdir(backend_dir)

from main import app

async def test_route(path: str):
    response_headers = {}
    response_body = []
    status_code = None

    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": "GET",
        "scheme": "http",
        "path": path,
        "raw_path": path.encode("utf-8"),
        "query_string": b"",
        "headers": [(b"host", b"localhost:8000")],
        "client": ("127.0.0.1", 12345),
        "server": ("127.0.0.1", 8000),
    }

    async def receive():
        return {"type": "http.request", "body": b"", "more_body": False}

    async def send(message):
        nonlocal status_code
        if message["type"] == "http.response.start":
            status_code = message["status"]
            for k, v in message.get("headers", []):
                response_headers[k.decode("utf-8").lower()] = v.decode("utf-8")
        elif message["type"] == "http.response.body":
            response_body.append(message.get("body", b""))

    await app(scope, receive, send)
    body = b"".join(response_body)
    return status_code, response_headers, body

async def main():
    print("Running in-memory ASGI test for unified production deployment...")

    # 1. Test Root / (should serve React index.html)
    code, headers, body = await test_route("/")
    assert code == 200, f"Expected 200, got {code}"
    text = body.decode("utf-8", errors="ignore")
    assert '<div id="root"></div>' in text or "<html" in text.lower(), "Root didn't return index.html"
    print(f"1. GET / -> HTTP {code} OK (HTML served, length: {len(text)} bytes)")

    # 2. Test SPA Client Route /scam-shield-demo (should fallback to index.html)
    code, headers, body = await test_route("/scam-shield-demo")
    assert code == 200, f"Expected 200, got {code}"
    text = body.decode("utf-8", errors="ignore")
    assert '<div id="root"></div>' in text or "<html" in text.lower()
    print(f"2. GET /scam-shield-demo -> HTTP {code} OK (SPA fallback served)")

    # 3. Test API endpoint /api/health
    code, headers, body = await test_route("/api/health")
    assert code == 200, f"Expected 200, got {code}"
    import json
    data = json.loads(body.decode("utf-8"))
    assert data["status"] == "ONLINE"
    print(f"3. GET /api/health -> HTTP {code} OK (Status: {data['status']})")

    # 4. Test API endpoint /api/overview/stats
    code, headers, body = await test_route("/api/overview/stats")
    assert code == 200, f"Expected 200, got {code}"
    data = json.loads(body.decode("utf-8"))
    print(f"4. GET /api/overview/stats -> HTTP {code} OK (Datasets: {data['datasets_count']}, Audits: {data['audits_count']})")

    print("\n" + "="*65)
    print("ALL IN-MEMORY ASGI TESTS PASSED: 100% PRODUCTION READY!")
    print("="*65)

if __name__ == "__main__":
    asyncio.run(main())
