#!/bin/bash
# 任一步失败立即退出，否则失败会被最后的 kill 吞掉，CI 门禁形同虚设
set -euo pipefail

cd ./meeting_room_booking_system_backend
# Dependabot 有时只更新 package.json 而未同步 pnpm-lock.yaml，
# 此时 --frozen-lockfile 会因 ERR_PNPM_OUTDATED_LOCKFILE 失败。
# 降级为 --no-frozen-lockfile 让 CI 自动重算 lockfile（fronted-template 的做法）。
pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile
pnpm test
pnpm build
