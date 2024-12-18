# prisma 相关issue: https://github.com/prisma/prisma/issues/19729

# 阶段 1：构建阶段
FROM node:20.1.0-alpine AS build

# 设置工作目录
WORKDIR /app

COPY . .

RUN corepack enable pnpm
RUN pnpm install

# 构建 NestJS 应用
RUN pnpm build

# 阶段 2：生产阶段
FROM node:20.1.0-alpine AS production

# 设置工作目录
WORKDIR /app

# 只复制需要的文件（避免复制多余的开发依赖和构建工具）
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/
COPY --from=build /app/prisma /app/.env.production.yaml /app/
COPY --from=build /app/templates/captcha.html /app/templates/captcha.html
COPY --from=build /app/dist /app/dist

# # 安装生产环境依赖
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile --production

ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=production

# 暴露应用端口
EXPOSE 6020

# 设置环境变量
ENV PORT 6020

# 启动应用
CMD ["pnpm", "start:migrate:prod"]
