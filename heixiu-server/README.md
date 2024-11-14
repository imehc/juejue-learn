# 初始化数据库

> 在该根目录下 .env文件下填写你对应的sql地址,示例地址如下

<!--
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings
-->

```bash
DATABASE_URL="postgresql://root:2024@localhost:5432/chat-room?schema=public"
```

> 使用docker启动或配置数据库

``` bash
docker run --name chat-room-db \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=2024 \
  -e POSTGRES_DB=chat-room \
  -e TZ='Asia/Shanghai' \
  -e ALLOW_IP_RANGE=0.0.0.0/0 \
  -v /Users/tom/person/learning/postgresql-data:/var/lib/postgresql \
  -p 5432:5432 \
  --restart always \
  -d postgres 
```

```bash
# 重置数据库
npx prisma migrate reset 
# 创建新的 migration
npx prisma migrate dev --name user
```