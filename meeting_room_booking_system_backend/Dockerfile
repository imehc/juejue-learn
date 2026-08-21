###################
# BUILD
###################

# https://www.tomray.dev/nestjs-docker-production
FROM node:22-alpine AS build

WORKDIR /usr/src/app

# 先只拷依赖清单，让 node_modules 这层能被缓存，改源码不会触发重装。
# pnpm-workspace.yaml 必须一起拷：lockfile 里记了 overrides，配置对不上时
# pnpm 直接 ERR_PNPM_LOCKFILE_CONFIG_MISMATCH；依赖构建脚本的放行
# （allowBuilds）也在里面。详见该文件自带的注释。
COPY --chown=node:node package.json pnpm-workspace.yaml yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 这一阶段要装全量依赖：nest build 依赖 @nestjs/cli，它是 devDependency
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY --chown=node:node . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

###################
# PRODUCTION DEPENDENCIES
###################

# 独立的干净阶段，从零只装生产依赖。
#
# 不要复用 build 阶段的 node_modules 再原地 --prod 裁剪：pnpm 是符号链接式
# 布局，原地裁剪会在 node_modules/.pnpm 虚拟store里留下 dev 包的残留目录，
# 白占体积。从零装则压根不会出现 dev 包。
#
# 这一阶段不依赖 build 阶段，BuildKit 会让两者并行跑。
FROM node:22-alpine AS prod-deps

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-workspace.yaml yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then \
    yarn install --frozen-lockfile --production && yarn cache clean; \
  elif [ -f package-lock.json ]; then \
    npm ci --omit=dev && npm cache clean --force; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm install --prod --frozen-lockfile; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

###################
# PRODUCTION
###################

FROM node:22-alpine AS production

# 必须设置工作目录：configuration.ts 用 resolve(__dirname, '../../.env.yaml')
# 定位配置，main.ts 用 __dirname/../uploads 作静态目录。不设 WORKDIR 时
# 这些路径会落到容器根目录 /，卷挂载点也就无从对应。
WORKDIR /usr/src/app

# 注意：原先这行写在 build 阶段，而镜像层的 ENV 不会跨阶段继承，所以运行时
# 其实一直没有 NODE_ENV=production（Express 因此跑在 development 模式）。
# 挪到这里才真正生效。生产依赖的筛选不靠它，靠 prod-deps 阶段的 --prod 参数。
# 配置文件的选择用的是另一个变量 NODE_ENVIRONMENT，由 compose 注入，
# 见 src/config/configuration.ts。
ENV NODE_ENV=production

# 只拿两样东西：干净的生产依赖 + 编译产物。
# pnpm 的 store 留在 prod-deps 阶段，不会进最终镜像。
COPY --chown=node:node --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# 注意：生产配置 .env.yaml 不打进镜像，由 deploy/docker-compose.yml 以
# 只读 bind mount 挂到 /usr/src/app/.env.yaml。改配置只需重启容器，
# 不用重新构建；镜像里也就不含任何凭据。
# 单独 docker run 时需自行挂载：
#   -v "$PWD/deploy/backend.env.yaml:/usr/src/app/.env.yaml:ro"

# uploads：main.ts 里的 /uploads 静态目录，compose 挂了 named volume
# daily-log：winston daily-rotate-file 需要写入
# 合成一条 RUN，少一个镜像层
RUN mkdir -p uploads daily-log && chown node:node uploads daily-log

USER node

EXPOSE 6020

ENV PORT=6020

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
