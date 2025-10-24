import subprocess

def init() -> None:
  try:
    subprocess.run(["pnpm", "--stream", "-r", "dev"])
  except subprocess.CalledProcessError:
    print("Error starting application!")

init()