#!/bin/sh
# ─────────────────────────────────────────────────────────────
# 建桶 + 开放匿名读。幂等：重复执行不报错，dev / 生产两套 compose 共用。
#
# 用官方 rc CLI 而不是 amazon/aws-cli：后者镜像 668MB，只为跑两条 s3api
# 命令，rustfs/rc 只有 68.7MB。
#
# 匿名读是必须的：前端头像是普通 <img src>（生产环境走 nginx 的 /oss 反代），
# 直接访问对象 URL，没有签名。不开策略的话头像一律 403。
# 写入仍然要签名 —— 预签名 PUT 由后端签发。
# ─────────────────────────────────────────────────────────────
set -eu

: "${RUSTFS_ACCESS_KEY:?RUSTFS_ACCESS_KEY 未设置，请检查 deploy/.env}"
: "${RUSTFS_SECRET_KEY:?RUSTFS_SECRET_KEY 未设置，请检查 deploy/.env}"
: "${BUCKET:?BUCKET 未设置，请检查 compose 里的 environment}"

# compose 里已有 depends_on: service_healthy，这里的重试是双保险：
# healthcheck 通过到 S3 接口真正可用之间仍有极短的窗口。
# region 不显式传：rc alias set 的 --region 默认就是 us-east-1，与后端
# 配置里的 oss-server.region 一致。
until rc alias set local http://rustfs:9000 "$RUSTFS_ACCESS_KEY" "$RUSTFS_SECRET_KEY"; do
  echo "等待 rustfs 就绪..."
  sleep 2
done

# --ignore-existing 让建桶天然幂等，不需要先 head-bucket 判断
rc mb --ignore-existing "local/$BUCKET"

# 等价于原先手写的那段 bucket policy JSON（对匿名放开 s3:GetObject）。
# 用 `bucket anonymous`，不是 `rc anonymous`——后者已被 rc 0.1.30 标记 deprecated。
# 参数顺序是 <PERMISSION> <PATH>。
rc bucket anonymous set download "local/$BUCKET"

echo "bucket $BUCKET 就绪，已开放匿名读"
