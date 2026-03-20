"""
TARE AEGIS-ID — Single-command launcher
Run: python run.py
"""
import subprocess
import sys
import os
import socket
import webbrowser
import threading
import time

def find_free_port(start=8003, end=8020):
    for port in range(start, end):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("0.0.0.0", port))
                return port
            except OSError:
                continue
    raise RuntimeError("No free port found between 8003 and 8020")

os.chdir(os.path.join(os.path.dirname(__file__), "backend"))

port = find_free_port()

print("=" * 55)
print("  TARE AEGIS-ID — Autonomous Entity Grid Identity System")
print("=" * 55)
print()
print(f"  Starting server on port {port}...")
print(f"  Opening browser at:  http://localhost:{port}")
print()
print("  Press Ctrl+C to stop.")
print()

# Auto-open browser after 2 seconds
def open_browser():
    time.sleep(2)
    webbrowser.open(f"http://localhost:{port}")

threading.Thread(target=open_browser, daemon=True).start()

subprocess.run([
    sys.executable, "-m", "uvicorn",
    "main:app",
    "--port", str(port),
    "--host", "0.0.0.0",
], check=True)
