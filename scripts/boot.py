import subprocess
import sys

def cleanup() -> None:
  """
  Shuts down any docker infrastructure that is currently running. Does not propagate any errors, only error messages if there are issues shutting down the infrastructure.
  """

  print("Shutting down docker infrastructure...")
  try:
    subprocess.run(["docker", "compose", "down"], check=True)
    print("Docker infrastructure stopped successfully!")
  except subprocess.CalledProcessError:
    print("Error shutting down docker infrastructure!")

def start_infrastructure() -> None:
  """
  Starts the Docker infrastructure such that both redis and mongodb containers are launched. Does not propagate any errors, only prints an error message and than exits with an error code.
  """
  print("Booting up redis and mongodb...")
  try:
    subprocess.run(["docker", "compose", "up", "-d"], check=True)
  except subprocess.CalledProcessError:
    print("Error starting docker infrastructure!")
    exit(1)

start_infrastructure()
try:
  subprocess.run([sys.executable, "scripts/start.py"], check=True)
except (KeyboardInterrupt, subprocess.CalledProcessError):
  pass
finally:
  cleanup()