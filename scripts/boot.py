import subprocess

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

start_infrastructure()
try:
  subprocess.run(["python3", "scripts/start.py"], check=True)
except (KeyboardInterrupt, subprocess.CalledProcessError):
  pass
finally:
  cleanup()