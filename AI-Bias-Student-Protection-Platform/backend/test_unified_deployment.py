import os
import sys
import time
import threading
import urllib.request
import json
import uvicorn

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)
os.chdir(backend_dir)

from main import app

class ServerThread(threading.Thread):
    def __init__(self, app, host="127.0.0.1", port=8001):
        super().__init__(daemon=True)
        config = uvicorn.Config(app, host=host, port=port, log_level="warning")
        self.server = uvicorn.Server(config)

    def run(self):
        self.server.run()

    def stop(self):
        self.server.should_exit = True

if __name__ == "__main__":
    port = 8001
    server_thread = ServerThread(app, port=port)
    server_thread.start()
    time.sleep(2)

    base_url = f"http://127.0.0.1:{port}"
    print(f"Testing unified deployment on {base_url}...")

    # 1. Test Root / (should serve React SPA index.html)
    with urllib.request.urlopen(f"{base_url}/") as resp:
        html = resp.read().decode()
        assert '<div id="root"></div>' in html or "<html" in html.lower(), "Root index.html not served"
        print(f"1. Root URL (/) serves React SPA HTML: SUCCESS! (Size: {len(html)} bytes)")

    # 2. Test SPA sub-route /scam-shield-demo (client-side routing fallback)
    with urllib.request.urlopen(f"{base_url}/scam-shield-demo") as resp:
        html = resp.read().decode()
        assert '<div id="root"></div>' in html or "<html" in html.lower(), "SPA route fallback failed"
        print("2. Client-side route (/scam-shield-demo) serves React SPA: SUCCESS!")

    # 3. Test API endpoint /api/health
    with urllib.request.urlopen(f"{base_url}/api/health") as resp:
        data = json.loads(resp.read().decode())
        assert data["status"] == "ONLINE"
        print("3. API endpoint (/api/health) returns JSON: SUCCESS!", data["status"])

    # 4. Test API endpoint /api/overview/stats
    with urllib.request.urlopen(f"{base_url}/api/overview/stats") as resp:
        data = json.loads(resp.read().decode())
        print(f"4. API endpoint (/api/overview/stats) returns data: SUCCESS! Datasets: {data['datasets_count']}, Audits: {data['audits_count']}")

    print("\n" + "="*65)
    print("ALL TESTS PASSED: UNIFIED DEPLOYMENT IS FULLY FUNCTIONAL!")
    print("="*65)

    server_thread.stop()
