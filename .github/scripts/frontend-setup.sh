#!/bin/bash
# 任一步失败立即退出，否则失败会被最后的 kill 吞掉，CI 门禁形同虚设
set -euo pipefail

cd ./meeting_room_booking_system_frontend
# 同 backend：严格 frozen，lockfile 必须随 package.json 同步进 PR
pnpm install --frozen-lockfile
pnpm dlx @openapitools/openapi-generator-cli generate \
  -g typescript-fetch \
  -c ./openapi-generator.config.yaml \
  -o ./meeting-room-booking-api \
  -i ../meeting_room_booking_system_backend/openapi.yaml
pnpm build
