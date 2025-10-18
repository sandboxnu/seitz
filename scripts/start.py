import subprocess

def init() -> None:
  try:
    subprocess.run(["pnpm", "--stream", "-r", "dev"], check=True)
  except subprocess.CalledProcessError:
    print("Error starting application!")
    exit(1)

init()