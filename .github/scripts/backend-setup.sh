#!/bin/bash
# 任一步失败立即退出，否则失败会被最后的 kill 吞掉，CI 门禁形同虚设
set -euo pipefail

cd ./meeting_room_booking_system_backend
# 严格 frozen：lockfile 与 package.json 不一致必须直接失败（fail loud），
# 逼迫 Dependabot 把 pnpm-lock.yaml 同步进 PR，而不是让 CI 偷偷重算。
pnpm install --frozen-lockfile
pnpm test
pnpm build
