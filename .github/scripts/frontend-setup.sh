#!/bin/bash

cd ./meeting_room_booking_system_frontend
pnpm install
pnpm gen:apis
pnpm build
pnpm start
pnpm test
kill $(lsof -t -i:6022) || true
