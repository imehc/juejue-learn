## Usage

### 直接运行
``` bash
# -d 后台运行
docker compose up
``` 

### 单独运行`Dockerfile`文件
> 进入对应目录
``` bash
# 例
cd meeting_room_booking_system_frontend
docker build -t meeting_room_booking_system_frontend .
docker run -p 6022:6022 -d meeting_room_booking_system_frontend
```

<!-- docker配置开发环境 -->
<!-- https://levelup.gitconnected.com/setting-up-a-local-development-environment-with-next-js-0049cfd6d437 -->
<!-- 配置nginx -->
<!-- https://medium.com/@wwdhfernando/efficient-deployment-of-next-js-24fd2825d6b4 -->
<!-- https://medium.com/@wwdhfernando/efficient-deployment-of-next-js-11a4e8947d9b -->

## 本地开发
> 先进入`meeting_room_booking_system_backend`目录，在`src`目录下修改`.env`文件中的`redis_server_host`和`mysql_server_host`地址为`localhost`,修改`nodemailer` 相关配置