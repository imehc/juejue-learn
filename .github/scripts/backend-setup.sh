#!/bin/bash

cd ./meeting_room_booking_system_backend
pnpm install
pnpm test
pnpm build
# pnpm start
kill $(lsof -t -i:6020) || true
