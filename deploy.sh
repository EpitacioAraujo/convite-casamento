#!/bin/sh
set -e
cd "$(dirname "$0")"
git pull
ln -sfn ../.env .env
chmod 600 ../.env
docker compose -p convite up -d --build
