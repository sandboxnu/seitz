help:
	@echo "Commands:"
	@echo "  make build    - Build all images"
	@echo "  make up       - Start production"
	@echo "  make dev      - Start development"
	@echo "  make down     - Stop services"
	@echo "  make logs     - View logs"
build:
	docker compose build --no-cache

up:
	docker compose up -d

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up

down:
	docker compose down

logs:
	docker compose logs -f

clean:
	docker compose down -v
	docker system prune -f

shell:
	docker compose exec $(service) sh

restart:
	docker compose restart

health:
	@curl -s http://localhost:4000/health | jq '.' || echo "API health check failed"
	@curl -s http://localhost:8080 > /dev/null && echo "Frontend is healthy" || echo "Frontend health check failed"

redis-cli:
	docker compose exec redis redis-cli

setup:
	@if [ ! -f .env ]; then cp .env.example .env && echo "Update .env with your values"; fi
	@pnpm install