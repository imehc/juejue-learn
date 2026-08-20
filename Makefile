# ─────────────────────────────────────────────────────────────
# 开发环境 / 生产环境的常用操作
#
#   make dev-up      启动开发用基础设施（MySQL / Redis / RustFS）
#   make dev-down    停止开发用基础设施
#   make dev-logs    跟踪开发用基础设施日志
#   make migrate     手动对开发库执行 TypeORM 迁移
#   make init-data   dev-up + migrate
#   make prod-up     构建并启动整套生产环境（含 nginx，暴露 80）
#   make prod-down   停止生产环境
#   make prod-logs   跟踪生产环境日志
#   make prod-migrate 手动对生产库执行 TypeORM 迁移
#   make clean       停止两套环境并删除数据卷（会丢数据）
#
# 注意：后端开了 migrationsRun（见 src/app.module.ts），启动时会自动执行
# 未跑过的迁移，所以 migrate / prod-migrate 平时不需要跑，只在手动补跑
# 或排查时用。
#
# 部署相关的文件都在 deploy/ 下，配置也放在那里：
#   deploy/.env              ← cp deploy/.env.example deploy/.env
#   deploy/backend.env.yaml  ← 生产环境才需要，见 prod-up 的提示
# ─────────────────────────────────────────────────────────────

DEPLOY = deploy
DEV_COMPOSE = docker compose --project-directory $(DEPLOY) -f $(DEPLOY)/docker-compose.dev.yml
PROD_COMPOSE = docker compose --project-directory $(DEPLOY) -f $(DEPLOY)/docker-compose.yml
PROD_MIGRATE_COMPOSE = $(PROD_COMPOSE) -f $(DEPLOY)/docker-compose.migrate.yml
BACKEND = meeting_room_booking_system_backend

.PHONY: dev-up dev-down dev-logs migrate init-data prod-up prod-down prod-logs prod-migrate clean check-env

# deploy/.env 必须存在：compose 用它解析 ${VAR}，mysql 容器也用它做 env_file
check-env:
	@test -f $(DEPLOY)/.env || { \
		echo "缺少 $(DEPLOY)/.env，请先执行："; \
		echo "  cp $(DEPLOY)/.env.example $(DEPLOY)/.env"; \
		echo "然后填入真实配置"; \
		exit 1; \
	}

# 只 --wait 常驻服务：一次性容器（rustfs-permission-helper / rustfs-init）
# 跑完就退出，--wait 会把「已退出」当成失败
dev-up: check-env
	@echo "启动基础设施，等待健康检查通过..."
	$(DEV_COMPOSE) up -d --wait mysql redis rustfs
	$(DEV_COMPOSE) up -d

dev-down:
	$(DEV_COMPOSE) down

dev-logs:
	$(DEV_COMPOSE) logs -f

# 迁移在主机上跑，连的是 docker-compose.dev.yml 映射出来的 127.0.0.1:3306。
# 连接凭据由 src/data-source.ts 直接读 deploy/.env，无需另外维护一份。
# 后端启动时已会自动跑迁移，这里只用于手动补跑或排查。
migrate: check-env
	cd $(BACKEND) && pnpm install && pnpm migration:run

# 起基础设施 + 手动灌一次初始数据。通常直接 make dev-up 即可，
# 后端 pnpm dev 起来时会自动建表灌数据。
init-data: dev-up migrate

prod-up: check-env
	@test -f $(DEPLOY)/backend.env.yaml || { \
		echo "缺少 $(DEPLOY)/backend.env.yaml，请先执行："; \
		echo "  cp $(DEPLOY)/backend.env.example.yaml $(DEPLOY)/backend.env.yaml"; \
		echo "并把各服务 host 改为服务名（mysql / redis / rustfs）"; \
		exit 1; \
	}
	$(PROD_COMPOSE) up -d --build

prod-down:
	$(PROD_COMPOSE) down

prod-logs:
	$(PROD_COMPOSE) logs -f

# 对生产库执行迁移：临时把 mysql 的 3306 映射到 127.0.0.1（见
# deploy/docker-compose.migrate.yml），跑完立刻收回端口。
# 后端容器启动时已会自动跑迁移，这里只用于手动补跑或排查。
prod-migrate: check-env
	@echo "临时开放 mysql 3306 端口..."
	$(PROD_MIGRATE_COMPOSE) up -d --wait mysql
	cd $(BACKEND) && pnpm install && pnpm migration:run
	@echo "收回 mysql 3306 端口..."
	$(PROD_COMPOSE) up -d --force-recreate mysql

# 注意：会连数据卷一起删除，MySQL 数据、对象存储内容都会丢
clean:
	$(DEV_COMPOSE) down -v
	$(PROD_COMPOSE) down -v
