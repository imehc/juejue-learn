#!/bin/bash

cd ./meeting_room_booking_system_backend
pnpm install
pnpm build
pnpm start
pnpm test
kill $(lsof -t -i:6020) || true
