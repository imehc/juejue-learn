# 使用 openapitools/openapi-generator-cli 生成api文档
FROM openapitools/openapi-generator-cli:v6.6.0 as openapi-generate-stage

WORKDIR /app 

COPY meeting_room_booking_system_frontend/openapi-generator.config.yaml .
COPY meeting_room_booking_system_backend/openapi.yaml ./openapi.yaml
# 生产环境修改为容器的地址，否则请求不到，图片问题待解决
RUN sed -i 's|http://127.0.0.1:6020|http://api:6020|g' ./openapi.yaml

# https://stackoverflow.com/questions/71931716/dockerfile-openapi-generator
RUN bash /usr/local/bin/docker-entrypoint.sh generate -g typescript-fetch -c ./openapi-generator.config.yaml -o ./meeting-room-booking-api -i ./openapi.yaml

# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# FROM node:22.3 AS base
# 非常小的镜像体积
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY meeting_room_booking_system_frontend/package.json meeting_room_booking_system_frontend/yarn.lock* meeting_room_booking_system_frontend/package-lock.json* meeting_room_booking_system_frontend/pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=openapi-generate-stage /app/meeting-room-booking-api ./meeting-room-booking-api
COPY --from=deps /app/node_modules ./node_modules
COPY meeting_room_booking_system_frontend .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 6022

ENV PORT 6022

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js