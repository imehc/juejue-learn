### 数据库
#### 创建
``` sql
CREATE DATABASE meeting_room_booking_system DEFAULT CHARACTER SET utf8mb4;
```

``` bash
docker run -d \
  --name meeting-room-booking-system \
  -e MYSQL_ROOT_PASSWORD=admin \
  -e MYSQL_DATABASE=meeting_room_booking_system \
  -p 3306:3306 \
  -v /d/warehouse/mysql:/var/lib/mysql \
  mysql:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```

### Reids
#### 创建
``` bash
 docker run -d --name meeting-room-booking-system-redis -p 6379:6379 redis
 ```