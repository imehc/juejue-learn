###################
# BUILD FOR LOCAL DEVELOPMENT
###################

# https://www.tomray.dev/nestjs-docker-production
FROM node:22-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package.json pnpm-workspace.yaml yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:22-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-workspace.yaml yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN \
  if [ -f yarn.lock ]; then \
    yarn install --frozen-lockfile --production && \
    yarn cache clean; \
  elif [ -f package-lock.json ]; then \
    npm ci --only=production && \
    npm cache clean --force; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && \
    pnpm install --prod && \
    pnpm prune; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi


USER node

###################
# PRODUCTION
###################

FROM node:22-alpine As production

# 必须设置工作目录：configuration.ts 用 resolve(__dirname, '../../.env.yaml')
# 定位配置，main.ts 用 __dirname/../uploads 作静态目录。不设 WORKDIR 时
# 这些路径会落到容器根目录 /，卷挂载点也就无从对应。
WORKDIR /usr/src/app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# 注意：生产配置 .env.yaml 不打进镜像，由 deploy/docker-compose.yml 以
# 只读 bind mount 挂到 /usr/src/app/.env.yaml。改配置只需重启容器，
# 不用重新构建；镜像里也就不含任何凭据。
# 单独 docker run 时需自行挂载：
#   -v "$PWD/deploy/backend.env.yaml:/usr/src/app/.env.yaml:ro"

# 静态文件目录，compose 里挂了 named volume
RUN mkdir -p uploads && chown node:node uploads

# 日志目录，winston daily-rotate-file 需要写入
RUN mkdir -p daily-log && chown node:node daily-log

USER node

EXPOSE 6020

ENV PORT 6020

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
