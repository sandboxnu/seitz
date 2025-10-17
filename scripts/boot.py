import subprocess

def cleanup():
  try:
    subprocess.run(["docker", "compose", "down"])
  except (Exception):
    subprocess.run(["echo", "Error shutting down docker infrastructure!"])

subprocess.run(["echo", "Booting up redis and mongodb infrastructure..."])
