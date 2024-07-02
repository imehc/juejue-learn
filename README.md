## Usage
### 服务端
> 进入`meeting_room_booking_system_backend`目录,需要先修改.env中的邮件配置信息
``` shell
cd meeting_room_booking_system_backend
docker compose up -d
``` 
### 客户端
> 进入`meeting_room_booking_system_frontend`目录
``` shell
cd meeting_room_booking_system_frontend
docker build -t meeting_room_booking_system_frontend .
docker run -p 6022:6022 -d meeting_room_booking_system_frontend
```

<!-- https://medium.com/@wwdhfernando/efficient-deployment-of-next-js-24fd2825d6b4 -->
<!-- https://medium.com/@wwdhfernando/efficient-deployment-of-next-js-11a4e8947d9b -->