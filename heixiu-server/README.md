# 初始化数据库

> 在该根目录下 .env文件下填写你对应的sql地址,示例地址如下

<!--
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings
-->

```bash
DATABASE_URL="postgresql://[用户名]:[密码]@localhost:5432/chat-room?schema=public"
```

> 使用docker启动或配置数据库

``` bash
docker run --name chat-room-db \
  -e POSTGRES_USER=[用户名] \
  -e POSTGRES_PASSWORD=[密码] \
  -e POSTGRES_DB=chat-room \
  -e TZ='Asia/Shanghai' \
  -e ALLOW_IP_RANGE=0.0.0.0/0 \
  # -v 数据卷挂载
  # -v /Users/tom/person/learning/postgresql-data:/var/lib/postgresql \
  -p 5432:5432 \
  --restart always \
  -d postgres 
```

```bash
# 重置数据库
npx prisma migrate reset 
# 创建新的 migration
npx prisma migrate dev --name [名称]
```

# nest命令

```bash
# 创建module
nest g module [名称]
# 创建service
nest g service [名称] --no-spec 
# 创建resource
nest g resource [名称]
# 创建gurad
nest g guard [名称] --flat --no-spec
# 生成客户端类型
npx prisma generate
```

# 启动项目

## 开发阶段

> 需要正确配置`.env.dev.yaml`文件,结构参照`.env.yaml`文件

## 生产阶段

> 需要正确配置`.env.yaml`文件

# 工具

> [yaml转typescript](https://portal.he3app.com/home/extension/yaml-to-typescript-interface)

# TODO

- [ ]  双刷token
- [ ]  返回的token不宜过长
- [ ]  获取新token原token失效