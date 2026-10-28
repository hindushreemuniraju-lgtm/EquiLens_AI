import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from main import app
    print("SUCCESS: main.py imported successfully!")
    print(f"App title: {app.title}")
    print(f"Total routes registered: {len(app.routes)}")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
