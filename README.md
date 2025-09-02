# 会议室预订系统

## 项目结构

本项目使用 pnpm monorepo 管理前后端代码：

- `meeting_room_booking_system_backend`: 后端 NestJS 项目
- `meeting_room_booking_system_frontend`: 前端 Next.js 项目

## 依赖管理

项目使用 pnpm 进行依赖管理，通过 monorepo 结构统一管理前后端依赖。

安装依赖：
```bash
pnpm install
```

## Usage

### 首次运行
``` bash
make init-data
```

### 直接运行
> 运行之前需要将`meeting_room_booking_system_backend`下的`.env.dev.yaml`中配置修改,随后需要重命名为`.env.yaml`即可
``` bash
# -d 后台运行
docker compose up
``` 

### 单独运行`Dockerfile`文件
> 进入对应目录
``` bash
# 例
cd meeting_room_booking_system_frontend
docker build -t meeting_room_booking_system_frontend .
docker run -p 6022:6022 -d meeting_room_booking_system_frontend
```

<!-- docker配置开发环境 -->
<!-- https://levelup.gitconnected.com/setting-up-a-local-development-environment-with-next-js-0049cfd6d437 -->
<!-- 配置nginx -->
<!-- https://medium.com/@wwdhfernando/efficient-deployment-of-next-js-24fd2825d6b4 -->
<!-- https://medium.com/@wwdhfernando/efficient-deployment-of-next-js-11a4e8947d9b -->

## 本地开发
> 先进入`meeting_room_booking_system_backend`目录，修改`.env.dev.yaml`配置
