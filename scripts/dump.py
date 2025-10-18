import os
import subprocess

def load_env(filepath='../packages/api/.env'):
  with open(filepath) as f:
    for line in f:
      line = line.strip()
      if line and not line.startswith('#') and '=' in line:
        key, value = line.split('=', 1)
        os.environ[key.strip()] = value.strip()

load_env()
mongo_url = os.getenv('MONGO_URL')

