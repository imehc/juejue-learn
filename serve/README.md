# NestJS项目

## 项目说明
这是一个基于NestJS框架开发的项目。

### 多语言验证
本项目使用nestjs-i18n进行多语言验证，支持全局验证配置。详细信息请参考：
- [NestJS-i18n Global Validation](https://nestjs-i18n.com/guides/dto_validation/global-validation) - 用于配置全局多语言验证，支持DTO验证消息的国际化。

## 环境要求
- Node.js
- Docker
- PostgreSQL (通过Docker运行)
- Redis (通过Docker运行)

## 数据库配置

### PostgreSQL数据库启动
使用以下Docker命令启动PostgreSQL数据库：

```bash
docker run -d \
  --name postgres-exix \
  -e POSTGRES_PASSWORD=exix2025 \
  -e POSTGRES_USER=exix \
  -e POSTGRES_DB=exix_db \
  -p 5432:5432 \
  -v /Users/tom/person/learning/postgresql-data3:/var/lib/postgresql/data \
  postgres:latest
```

### PostgreSQL配置说明
- 容器名称：postgres-exix
- 数据库用户名：exix
- 数据库密码：exix2025
- 数据库名称：exix_db
- 端口映射：5432:5432
- 数据持久化目录：/Users/tom/person/learning/postgresql-data3

### Redis数据库启动
使用以下Docker命令启动Redis数据库：

```bash
docker run -d --name redis-exix -p 6379:6379 redis:latest --requirepass exix2025 
```

### Redis配置说明
- 容器名称：redis-exix
- Redis用户名：exix
- Redis密码：exix2025
- 端口映射：6379:6379

## 项目安装

```bash
pnpm install
```

## 运行项目

```bash
# 开发模式
pnpm run start:dev

# 生产模式
pnpm run start:prod
```

## 开发工具

### NestJS CLI 命令
以下是一些常用的NestJS CLI命令，可以帮助快速生成项目文件：

```bash
# 生成模块
nest generate module <模块名>
# 简写形式
nest g mo <模块名>

# 生成控制器
nest generate controller <控制器名>
# 简写形式
nest g co <控制器名>

# 生成服务
nest generate service <服务名>
# 简写形式
nest g s <服务名>

# 生成实体
nest generate class <实体名> entity
# 简写形式
nest g cl <实体名> entity

# 生成DTO
nest generate class <名称> dto
# 简写形式
nest g cl <名称> dto

# 生成接口
nest generate interface <接口名>
# 简写形式
nest g in <接口名>
```

### 配置文件类型生成
- [YAML to TypeScript](https://jsonformatter.org/yaml-to-typescript) - 用于将YAML配置文件转换为TypeScript类型定义的在线工具，可以帮助维护配置文件的类型安全性。

## 测试

```bash
# 单元测试
pnpm run test

# E2E测试
pnpm run test:e2e
```
