docker_compose_v2 = docker compose

# services
backend_path = ./backend
frontend_path = ./frontend

# docker compose configs 
docker_compose_config_backend_path = $(backend_path)/docker-compose.yml
docker_compose_config_frontend_path = $(frontend_path)/docker-compose.yml

# docker compose commands for services
backend = $(docker_compose_v2) -f $(docker_compose_config_backend_path) --env-file $(backend_path)/.env
frontend = $(docker_compose_v2) -f $(docker_compose_config_frontend_path) --env-file $(frontend_path)/.env


#TODO ========================================= COMMON =========================================
.PHONY: clean all docker data
prune:
	docker system prune --all --force --volumes
	docker volume prune --all --force
	docker image prune --all --force


#TODO ======================================== BACKEND =========================================

.PHONY: build backend
build_backend:
	$(backend) build

.PHONY: run backend
run_backend:
	$(backend) up

.PHONY: run backend in detach mode
run_backend_detached:
	$(backend) up -d

.PHONY: stop backend
stop_backend:
	$(backend) stop

.PHONY: delete backend
delete_backend:
	$(backend) down -v


#TODO ======================================== FRONTEND ========================================

.PHONY: build frontend
build_frontend:
	$(frontend) build

.PHONY: run frontend
run_frontend:
	$(frontend) up

.PHONY: run frontend in detach mode
run_frontend_detached:
	$(frontend) up -d

.PHONY: stop frontend
stop_frontend:
	$(frontend) stop

.PHONY: delete frontend
delete_frontend:
	$(frontend) down -v


#TODO ======================================== PROJECT =========================================

.PHONY: build project
build_project:
	$(MAKE) build_backend
	$(MAKE) build_frontend

.PHONY: run project
run_project:
	$(MAKE) run_backend
	$(MAKE) run_frontend

.PHONY: run project in detach mode
run_project_detached:
	$(MAKE) run_backend_detached
	$(MAKE) run_frontend_detached

.PHONY: stop project
stop_project:
	$(MAKE) stop_backend
	$(MAKE) stop_frontend

.PHONY: delete project
delete_project:
	$(MAKE) delete_backend
	$(MAKE) delete_frontend
