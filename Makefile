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

.PHONY: build-production
build-production: ## Build the production docker image.
	DOCKER_BUILDKIT=1 docker compose -f docker/production/docker-compose.yml build

.PHONY: publish-to-ecr
publish-to-ecr: ## Publish the production docker image.
	AWS_CONFIG_FILE=~/.aws/config
	aws ecr get-login-password --region il-central-1 | docker login --username AWS --password-stdin 705252976650.dkr.ecr.il-central-1.amazonaws.com

	docker tag app-prod:latest 705252976650.dkr.ecr.il-central-1.amazonaws.com/todo-app:app-prod
	docker tag server-prod:latest 705252976650.dkr.ecr.il-central-1.amazonaws.com/todo-app:server-prod
	docker tag db-prod:latest 705252976650.dkr.ecr.il-central-1.amazonaws.com/todo-app:db-prod

	docker push 705252976650.dkr.ecr.il-central-1.amazonaws.com/todo-app:app-prod
	docker push 705252976650.dkr.ecr.il-central-1.amazonaws.com/todo-app:server-prod
	docker push 705252976650.dkr.ecr.il-central-1.amazonaws.com/todo-app:db-prod