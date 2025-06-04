# Makefile

PROJECT_NAME=ecommerce

# ========================
# DOCKER COMPOSE COMMANDS
# ========================

up:
	docker-compose up --build

up-detached:
	docker-compose up --build -d

down:
	docker-compose down
	
restart: down up

logs:
	docker-compose logs -f

ps:
	docker-compose ps

# ========================
# DOCKER IMAGE MANAGEMENT
# ========================

build:
	docker-compose build

rebuild:
	docker-compose build --no-cache

# ========================
# CLEANUP
# ========================

clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

