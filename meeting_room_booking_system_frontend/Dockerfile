FROM node:22.3 AS build-stage

RUN mkdir -p /usr/app
WORKDIR /usr/app 
  
COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm install --production

# FROM openapitools/openapi-generator-cli AS openapi-generator

# RUN openapi-generator generate -g typescript-fetch -c ./openapi-generator.config.yaml -o ./meeting-room-booking-api -i ../meeting_room_booking_system_backend/openapi.yaml
COPY . .   

RUN pnpm run build 

EXPOSE 6022

CMD ["pnpm", "run", "start"]