#!/bin/bash

cleanup() {
  echo "[CLEANUP] Tearing down docker infrastructure"
  docker-compose down redis
}

trap cleanup SIGINT 

echo "[BOOT] Starting redis..."
docker-compose up -d redis

./start.sh || true