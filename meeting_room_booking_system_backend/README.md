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
  -v /Users/tom/person/learning/mysql-data:/var/lib/mysql \
  mysql:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```

### Reids
#### 创建
``` bash
 docker run -d --name meeting-room-booking-system-redis -p 6379:6379 redis
 ```

### Minio
#### 创建
``` bash
 docker run -d \
  --name meeting-room-booking-syste-minio \
  -p 9000:9000 \
  -p 9001:9001 \
  --env-file .env \
  -v /Users/tom/person/learning/minio-data:/bitnami/minio/data \
  bitnami/minio
 ```