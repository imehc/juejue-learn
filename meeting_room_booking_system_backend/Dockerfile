# 使用包含 pnpm 的 Node.js 镜像作为构建阶段
FROM node:22.3 as build-stage

WORKDIR /app

# 复制 package.json 到工作目录
COPY package.json .
COPY pnpm-lock.yaml .

# 配置 pnpm 的 registry
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/

RUN pnpm install

# 复制所有源代码到工作目录
COPY . .

RUN pnpm run build

# 使用 Node.js 镜像作为生产阶段
FROM node:22.3 as production-stage
# 从构建阶段复制构建后的文件到生产阶段
COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

# 配置 pnpm 的 registry
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/

# 使用 pnpm 安装生产环境依赖
RUN pnpm install --production

EXPOSE 6020

CMD ["node", "/app/main.js"]
