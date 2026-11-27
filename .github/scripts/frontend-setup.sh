#!/bin/bash
# 任一步失败立即退出，否则失败会被最后的 kill 吞掉，CI 门禁形同虚设
set -euo pipefail

cd ./meeting_room_booking_system_frontend
# 同 backend：严格 frozen，lockfile 必须随 package.json 同步进 PR
pnpm install --frozen-lockfile
# 走 devDependency 里钉死的 CLI（package.json -> gen:apis），不要再 pnpm dlx：
# dlx 每次从 registry 解析最新版，和 openapitools.json / Dockerfile 里钉的
# generator 版本会各走各的，同一份 openapi.yaml 生成出的客户端代码可能不一致
pnpm gen:apis
# 同 backend：Biome 大版本（2.6 起连 YAML/CSS 也管）只改配置语义不改命令，
# build 不报错但 check 会挂，必须单独门禁
pnpm lint
pnpm build
