# 会议室预订系统

pnpm monorepo，前后端分离，用 Docker Compose 编排。

```
.
├── deploy/                              # 部署相关的一切都在这里
│   ├── docker-compose.dev.yml           #   开发：只跑基础设施
│   ├── docker-compose.yml               #   生产：整个项目打包运行
│   ├── .env.example                     #   基础设施凭据模板
│   ├── backend.env.example.yaml          #   后端应用配置模板
│   └── nginx/nginx.conf                 #   生产环境反向代理
├── meeting_room_booking_system_backend/  # 后端 NestJS（6020）
├── meeting_room_booking_system_frontend/ # 前端 Next.js（dev 6021 / prod 6022）
└── Makefile                             # 常用命令的入口
```

## 目录

- [环境要求](#环境要求)
- [配置文件](#配置文件)
- [开发环境](#开发环境)
- [生产环境](#生产环境)
- [常用命令](#常用命令)
- [排查](#排查)

## 环境要求

| 工具 | 版本 |
| --- | --- |
| Node.js | >= 20 |
| pnpm | >= 10 |
| Docker | 带 Compose v2（`docker compose`，不是 `docker-compose`） |

## 配置文件

模板都在 `deploy/` 下并提交到仓库，填好的真实配置一律被 gitignore。

| 真实配置 | 从哪来 | 谁读它 |
| --- | --- | --- |
| `deploy/.env` | `cp deploy/.env.example deploy/.env` | Compose（解析 `${VAR}` + 注入 mysql 容器）、TypeORM 迁移 |
| `deploy/backend.env.yaml` | `cp deploy/backend.env.example.yaml deploy/backend.env.yaml` | 生产环境的后端容器（只读挂载为 `/usr/src/app/.env.yaml`） |
| `meeting_room_booking_system_backend/.env.dev.yaml` | 同一份模板复制过去 | 开发环境跑在主机上的后端 |

后端按 `NODE_ENVIRONMENT` 选文件（见 `src/config/configuration.ts`）：

```
NODE_ENVIRONMENT=production  →  .env.yaml     ← 生产，由 compose 挂载
其它（含未设置）              →  .env.dev.yaml ← 开发，放在后端目录里
```

**必须对齐的值**，写错了容器能起来但连不上：

| `deploy/.env` | 后端 yaml |
| --- | --- |
| `MYSQL_ROOT_PASSWORD` | `mysql-server.password` |
| `MYSQL_DATABASE` | `mysql-server.database` |
| `RUSTFS_ACCESS_KEY` | `oss-server.access-key` |
| `RUSTFS_SECRET_KEY` | `oss-server.secret-key` |
| `RUSTFS_BUCKET` | `oss-server.bucket-name` |

TypeORM 迁移直接读 `deploy/.env`（见 `src/data-source.ts`），不需要再维护一份连接配置。

> 对象存储用 RustFS 而不是 MinIO：MinIO 社区版已移除管理控制台、仓库也已归档，
> `bitnami/minio` 镜像从 Docker Hub 下架。后端改用 AWS 官方 S3 SDK
> （`@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`）走标准 S3 协议访问，
> 不依赖任何厂商特有 API，换成别的 S3 兼容实现（Ceph / 真 AWS S3）也不用改代码。
>
> 因此后端 yaml 里的键是中立的 `oss-server.*`，除凭据外还有两个：
> `use-ssl`（自建服务一般 `'false'`）和 `region`（自建 S3 没有 region 概念，
> 但 SDK 强制要求，须与建桶时用的一致 —— compose 里的 `rustfs-init` 用
> `us-east-1`）。`rustfs-init` 同时会给桶打上允许匿名 `s3:GetObject` 的策略：
> 头像是普通 `<img src>`，不带签名，不开这条策略一律 403；写入仍然要签名，
> 预签名 PUT 由后端 `/oss/presigned-url` 签发。

## 开发环境

只有 MySQL / Redis / RustFS 跑在容器里，前后端用 `pnpm dev` 跑在主机上，改代码即时生效。
容器端口只绑 `127.0.0.1`，不暴露到局域网。

```bash
# 1. 准备配置
cp deploy/.env.example deploy/.env
cp deploy/backend.env.example.yaml \
   meeting_room_booking_system_backend/.env.dev.yaml
# 编辑这两份文件填入真实值；.env.dev.yaml 里各 host 保持 localhost

# 2. 起基础设施 + 建表灌初始数据（首次只需这一条）
make init-data

# 3. 装依赖并启动前后端
pnpm install
pnpm dev
```

起来之后：

| 地址 | 说明 |
| --- | --- |
| http://localhost:6021 | 前端 |
| http://127.0.0.1:6020 | 后端 |
| http://127.0.0.1:6020/api-doc | Swagger |
| http://127.0.0.1:9001 | RustFS 控制台（只在开发环境开启） |

默认账号（由迁移数据初始化）：

| 登录页（前端路由） | 用户名 | 密码 | 说明 |
| --- | --- | --- | --- |
| /system-login | `root` | `111111` | 管理后台，登录后进 `/system` |
| /login | `admin` | `222222` | 普通用户端 |

数据库实体有变动时重新跑迁移：

```bash
cd meeting_room_booking_system_backend
pnpm migration:generate ./src/migrations/<名字>
pnpm migration:run
```

## 生产环境

整个项目打包运行：基础设施 + 后端 + 前端 + nginx，对外只开 80。数据库、缓存、
对象存储的端口都不映射到主机，仅容器网络内可达。

```bash
# 1. 准备配置
cp deploy/.env.example deploy/.env
cp deploy/backend.env.example.yaml deploy/backend.env.yaml
```

编辑 `deploy/backend.env.yaml` 时，**各服务的 host 要改成 compose 服务名**，
因为后端此时也在容器里：

```yaml
redis-server:
  host: redis
mysql-server:
  host: mysql
oss-server:
  endpoint: rustfs
```

第三方登录的回调地址也要改为走 nginx（`http://nginx/user/callback/...`），
`jwt.secret` 换成随机串（`openssl rand -hex 32`）。

```bash
# 2. 构建并启动
make prod-up

# 3. 建表灌初始数据（首次必须执行，否则后端查不到表，登录直接 500）
make prod-migrate
```

这份配置是以只读方式挂进容器的，不打进镜像 —— 改完配置只需 `make prod-down && make prod-up`
重启，不用重新构建，镜像里也不含任何凭据。

访问 http://localhost。nginx 的路由（见 `deploy/nginx/nginx.conf`）：

| 路径 | 转发到 |
| --- | --- |
| `/api/*` | `nest-api:6020`（剥掉 `/api` 前缀） |
| `/oss/*` | `rustfs:9000`（剥掉 `/oss` 前缀） |
| `/*` | `next-client:6022` |

镜像都固定大版本标签（`mysql:8.4` / `redis:8` / `nginx:1-alpine` 等），数据全部用
named volume（`mysql-data` / `redis-data` / `rustfs-data` / `rustfs-logs` /
`uploads`），不绑主机路径，换机器换用户都能直接跑。

### 生产环境的迁移

迁移脚本要 `ts-node` 和 `src/`，生产镜像里只有编译后的 `dist/`，所以迁移仍在主机上跑。
首次 `prod-up` 之后**必须执行一次迁移**，否则数据库里没有表，后端会返回 500。

```bash
make prod-migrate
```

该命令会临时把 mysql 的 3306 端口映射到 `127.0.0.1`，执行完迁移后自动收回。
不要另起一个 mysqld 容器去连同一个数据卷 —— 两个实例同时写会损坏数据。

## 常用命令

```bash
make dev-up      # 启动开发用基础设施
make dev-down    # 停止
make dev-logs    # 跟日志
make migrate     # 执行迁移
make init-data   # dev-up + migrate
make prod-up     # 构建并启动整套生产环境
make prod-down   # 停止
make prod-logs   # 跟日志
make prod-migrate # 对生产库执行迁移（首次 prod-up 后必须跑一次）
make clean       # 停止两套环境并删除数据卷（会丢数据）
```

直接用 compose 时注意加 `--project-directory`，否则 compose 找不到 `deploy/.env`：

```bash
docker compose --project-directory deploy -f deploy/docker-compose.dev.yml ps
```

单独构建某个子项目的镜像：

```bash
# 后端：context 是子目录
docker build -t mrbs-backend ./meeting_room_booking_system_backend

# 前端：context 是仓库根目录，因为构建时要读后端的 openapi.yaml 生成 API 客户端
docker build -f meeting_room_booking_system_frontend/Dockerfile -t mrbs-frontend .
```

后端镜像不含配置，单独 `docker run` 时要自己挂：

```bash
docker run -p 6020:6020 -e NODE_ENVIRONMENT=production \
  -v "$PWD/deploy/backend.env.yaml:/usr/src/app/.env.yaml:ro" mrbs-backend
```

## 排查

**改了 `deploy/.env` 里的 MySQL 密码但连不上。** MySQL 只在数据卷为空时初始化，卷里已有
数据时改密码不生效。需要 `make clean` 清卷后重建（会丢数据）。

**RustFS 报权限错误写不进 `/data`。** RustFS 以 uid/gid 10001 运行，而 named volume
初始属主是 root。compose 里的 `rustfs-permission-helper` 会先 chown 再放行 rustfs，
正常不需要手动干预；若手工删过卷，重新 `up` 即可。

**后端连不上 mysql/redis/rustfs。** 检查 `deploy/backend.env.yaml` 里的 host：生产环境
必须用服务名（`mysql` / `redis` / `rustfs`），用 `localh

**前端请求 404 或跨域。** 生产环境前端通过 `http://nginx/api` 访问后端
（见 `meeting_room_booking_system_frontend/helper/cookie.ts`），走的是容器网络内的
nginx，不是浏览器地址。

**催办/验证码等功能超时，前端提示"服务异常，请稍后重试"。** 这些功能依赖邮件发送
（nodemailer），如果 `nodemailer-server` 未配置或配置错误，SMTP 连接会超时后抛出
500 错误。需在配置文件中填写正确的 SMTP 信息（开发环境：
`meeting_room_booking_system_backend/.env.dev.yaml`，生产环境：
`deploy/backend.env.yaml`）：

```yaml
nodemailer-server:
  host: smtp.qq.com          # 或 smtp-mail.outlook.com
  port: 587
  user: xxx@qq.com           # 真实邮箱地址
  pass: 应用专用密码/授权码    # 不是邮箱登录密码
```

**查看服务状态：**

```bash
make prod-logs
make dev-logs
docker compose --project-directory deploy -f deploy/docker-compose.yml logs -f nest-api
```
