#!/bin/bash
# 任一步失败立即退出，否则失败会被最后的 kill 吞掉，CI 门禁形同虚设
set -euo pipefail

cd ./meeting_room_booking_system_backend
# 严格 frozen：lockfile 与 package.json 不一致必须直接失败（fail loud），
# 逼迫 Dependabot 把 pnpm-lock.yaml 同步进 PR，而不是让 CI 偷偷重算。
pnpm install --frozen-lockfile
# lint 也是门禁：ESLint 大版本升级经常只是收紧规则、不改 API，
# 光跑 build/test 完全发现不了，Dependabot 会一路绿灯合进来。
pnpm lint
# Vitest 只做转换、不做类型检查，spec 和 e2e 里的类型错误会被漏掉，
# 所以单独补一道 tsc --noEmit。
pnpm typecheck
pnpm test
pnpm build
