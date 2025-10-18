import subprocess
import signal
import sys

def cleanup():
  print("Shutting down docker infrastructure...")
  try:
    subprocess.run(["docker", "compose", "down"], check=True)
    print("Docker infrastructure stopped successfully!")
  except subprocess.CalledProcessError:
    print("Error shutting down docker infrastructure!")

def start_infrastructure():
  print("Booting up redis and mongodb...")
  try:
    subprocess.run(["docker", "compose", "up", "-d"], check=True)
  except subprocess.CalledProcessError:
    print("Error starting docker infrastructure!")
    exit(1)

def signal_handler(sig, frame):
  cleanup()
  sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
start_infrastructure()
try:
  subprocess.run(["python3", "./start.py"], check=True)
finally:
  cleanup()