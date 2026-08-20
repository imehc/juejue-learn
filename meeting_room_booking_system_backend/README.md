# 后端（NestJS）

基础设施（MySQL / Redis / RustFS）统一由 `deploy/` 下的 Docker Compose 编排，
不需要手动 `docker run`。启动方式、配置文件说明见[根目录 README](../README.md)。

## 配置

后端按 `NODE_ENVIRONMENT` 选择配置文件（见 `src/config/configuration.ts`）：

```
NODE_ENVIRONMENT=production  →  .env.yaml     ← 生产，由 compose 只读挂载进容器
其它（含未设置）              →  .env.dev.yaml ← 开发，放在本目录下
```

模板只有一份，在 `deploy/backend.env.example.yaml`：

```bash
# 本地开发
cp ../deploy/backend.env.example.yaml .env.dev.yaml

# 生产部署（配置放 deploy/ 下，由 compose 挂载，不放本目录）
cp ../deploy/backend.env.example.yaml ../deploy/backend.env.yaml
```

## 开发

```bash
# 先在仓库根目录起基础设施：make dev-up
pnpm install
pnpm start:dev      # http://127.0.0.1:6020，文档 /api-doc
```

## 迁移

连接凭据由 `src/data-source.ts` 直接读 `deploy/.env`，默认连 `127.0.0.1:3306`
（`docker-compose.dev.yml` 映射出来的端口）。连别的地址用环境变量覆盖：

```bash
MYSQL_HOST=... MYSQL_PORT=... pnpm migration:run
```

```bash
pnpm migration:generate ./src/migrations/<名字>   # 实体有变动后生成
pnpm migration:run                               # 执行
pnpm migration:revert                            # 回滚上一次
```

数据库需要 `utf8mb4`，compose 里已经通过
`mysqld --character-set-server=utf8mb4` 配好，手工建库时用：

```sql
CREATE DATABASE meeting_room_booking_system DEFAULT CHARACTER SET utf8mb4;
```
