CONTAINER_NAME=mysql-container # 请替换为你的实际容器名称
WAIT_TIME=20 # 等待时间，可根据实际情况调整

# 数据库有变动，请执行
# 如果执行失败就分开执行命令
init-data: check_docker_init
	cd meeting_room_booking_system_backend && \
	pnpm install && \
	pnpm migration:run && \
	docker compose down && \
	docker compose up -d

check_docker_init:
	@docker compose down
	@echo "Starting docker-compose with initialization file..."
	@docker compose -f docker-compose-init.yml up -d
	@echo "Waiting for the container to start..."
	@sleep $(WAIT_TIME) # 等待一定时间让容器完全启动

.PHONY: init-data check_docker_init