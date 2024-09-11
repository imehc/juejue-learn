#!/bin/bash

cd ./meeting_room_booking_system_frontend
pnpm install
pnpm dlx @openapitools/openapi-generator-cli generate -g typescript-fetch -c ./openapi-generator.config.yaml -o ./meeting-room-booking-api -i ../meeting_room_booking_system_backend/openapi.yaml
pnpm test
pnpm build
# PORT=6022 node .next/standalone/server.js
kill $(lsof -t -i:6022) || true
