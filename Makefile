.PHONY: build-development
build-development: ## Build the development docker image.
	DOCKER_BUILDKIT=0 docker compose -f docker/development/docker-compose.yml build

.PHONY: start-development
start-development: ## Start the development docker container.
	@if [ $(delete-data) = 1 ];then\
		docker container stop $$(docker container ps -aq);\
		docker container prune;\
		docker volume rm development_mysql-data;\
	fi

	DOCKER_BUILDKIT=0 docker compose -f docker/development/docker-compose.yml up

.PHONY: stop-development
stop-development: ## Stop the development docker container.
	DOCKER_BUILDKIT=0 docker compose -f docker/development/docker-compose.yml down

.PHONY: build-production
build-production: ## Build the production docker image.
	DOCKER_BUILDKIT=0 docker compose -f docker/production/docker-compose.yml build

.PHONY: start-production
start-production: ## Start the production docker container.
	DOCKER_BUILDKIT=0 docker compose -f docker/production/docker-compose.yml up -d

.PHONY: stop-production
stop-production: ## Stop the production docker container.
	DOCKER_BUILDKIT=0 docker compose -f docker/production/docker-compose.yml down