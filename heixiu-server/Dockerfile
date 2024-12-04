# 阶段 1：构建阶段
FROM node:22-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml prisma .env.production.yaml ./

# 安装构建依赖
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile --development

# 复制应用代码
COPY . .

# 构建 NestJS 应用
RUN pnpm build

# 阶段 2：生产阶段
FROM node:22-alpine AS production

# 设置工作目录
WORKDIR /app

# 只复制需要的文件（避免复制多余的开发依赖和构建工具）
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/prisma /app/
COPY --from=build /app/.env.production.yaml /app/
COPY --from=build /app/dist /app/dist

# 安装生产环境依赖
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile --production

ENV DATABASE_URL=$DATABASE_URL

# 暴露应用端口
EXPOSE 6020

# 设置环境变量
ENV PORT 6020

# 启动应用
CMD ["pnpm", "start:migrate:prod"]
