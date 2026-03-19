"""
TARE AEGIS-ID — Single-command launcher
Run: python run.py
Then open: http://localhost:8003
"""
import subprocess
import sys
import os

# Change to backend directory so aegis_engine.py and static/ are found
os.chdir(os.path.join(os.path.dirname(__file__), "backend"))

print("=" * 55)
print("  TARE AEGIS-ID — Autonomous Entity Grid Identity System")
print("=" * 55)
print()
print("  Starting server...")
print("  Open your browser at:  http://localhost:8003")
print()
print("  Press Ctrl+C to stop.")
print()

subprocess.run([
    sys.executable, "-m", "uvicorn",
    "main:app",
    "--port", "8003",
    "--host", "0.0.0.0",
], check=True)
