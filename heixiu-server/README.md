# 初始化数据库

> 在该根目录下 .env文件下填写你对应的sql地址,示例地址如下

<!--
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings
-->
 <!-- 注意docker部署时需要指定docker数据库容器名称为部署localhost -->
```bash
DATABASE_URL="postgresql://[用户名]:[密码]@[主机]:5432/[数据库]?schema=public"
```

> 使用docker启动或配置数据库

``` bash
docker run --name chat-room-db \
  -e POSTGRES_USER=[用户名] \
  -e POSTGRES_PASSWORD=[密码] \
  -e POSTGRES_DB=[数据库] \
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
# 预览迁移 但不立即执行迁移
npx prisma migrate dev --name [名称] --create-only
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

> 添加`.env.dev.yaml`文件,结构参照`.env.example.yaml`文件

> 添加`.env`文件,结构参照`.env.example`文件

## 生产阶段

> 添加`.env.production.yaml`文件，文件格式参考`.env.example.yaml`

> 添加`.env.production`文件，文件格式参考`.env.example`，用于`docker`部署配置文件

# 工具

> [yaml转typescript](https://portal.he3app.com/home/extension/yaml-to-typescript-interface)

# TODO

- [x]  双刷token
- [ ]  返回的token不宜过长
- [x]  获取新token原token失效