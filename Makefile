CONTAINER_NAME=postgresql-container # 请替换为你的实际容器名称
WAIT_TIME=20 # 等待时间，可根据实际情况调整

# 数据库有变动，请执行
# 如果执行失败就分开执行命令
init-data: check_docker_init
	cd heixiu-server && \
	pnpm install && \
	docker compose down && \
	docker compose up -d

# docker-compose down --rmi all 会移除所有与项目相关的镜像，而不仅仅是那些没有被其他容器使用的镜像
check_docker_init:
	@docker-compose down --rmi all 
	@echo "Starting docker-compose with initialization file..."
	@docker compose -f docker-compose-init.yml up -d
	@echo "Waiting for the container to start..."
	@sleep $(WAIT_TIME) # 等待一定时间让容器完全启动

# 指定env文件启动容器
# docker compose -f docker-compose-init.yml --env-file ./heixiu-server/.env.production up -d

.PHONY: init-data check_docker_init