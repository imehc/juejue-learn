import { MigrationInterface, QueryRunner } from 'typeorm';

export class Data1720092651777 implements MigrationInterface {
  // 执行迁移 导出sql中的INSERT语句 注意插入顺序
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO `users` VALUES (1,'violawisok','e3ceb5881a0a1fdaad01296d7554868d','谌凤英','Kylee.Grant@gmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/8.jpg',NULL,1,0,'2024-07-04 11:01:01.277713','2024-07-04 11:01:01.277713'),(2,'admin','e3ceb5881a0a1fdaad01296d7554868d','高海燕','Anthony.Kovacek60@gmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/943.jpg',NULL,0,0,'2024-07-04 11:01:01.293397','2024-07-04 11:01:01.293397'),(3,'rubybechte','e3ceb5881a0a1fdaad01296d7554868d','丑浩辰','Rosina92@yahoo.com','https://avatars.githubusercontent.com/u/50324352',NULL,0,0,'2024-07-04 11:01:01.309722','2024-07-04 11:01:01.309722'),(4,'marioreich','e3ceb5881a0a1fdaad01296d7554868d','袭紫林','Jeramie71@hotmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/196.jpg',NULL,0,0,'2024-07-04 11:01:01.323456','2024-07-04 11:01:01.323456'),(5,'kristinweb','e3ceb5881a0a1fdaad01296d7554868d','衡国秀','Krystina41@gmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/81.jpg',NULL,0,0,'2024-07-04 11:01:01.337953','2024-07-04 11:01:01.337953'),(6,'rafaelglov','e3ceb5881a0a1fdaad01296d7554868d','善国荣','Ewald.Monahan44@hotmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/69.jpg',NULL,0,0,'2024-07-04 11:01:01.352416','2024-07-04 11:01:01.352416'),(7,'dr.antonia','e3ceb5881a0a1fdaad01296d7554868d','睦敏','Blaise.Okuneva44@yahoo.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1128.jpg',NULL,0,0,'2024-07-04 11:01:01.365922','2024-07-04 11:01:01.365922'),(8,'yolandasch','e3ceb5881a0a1fdaad01296d7554868d','袭明','Trenton23@gmail.com','https://avatars.githubusercontent.com/u/97873930',NULL,0,0,'2024-07-04 11:01:01.378245','2024-07-04 11:01:01.378245'),(9,'dr.gerardo','e3ceb5881a0a1fdaad01296d7554868d','左文昊','Quentin72@gmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/572.jpg',NULL,1,0,'2024-07-04 11:01:01.393712','2024-07-04 11:01:01.393712'),(10,'ameliadool','e3ceb5881a0a1fdaad01296d7554868d','森奕辰','Edwin_Jaskolski@hotmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/941.jpg',NULL,0,0,'2024-07-04 11:01:01.408272','2024-07-04 11:01:01.408272'),(11,'reneewillm','e3ceb5881a0a1fdaad01296d7554868d','单于超栋','Foster.Wolf57@gmail.com','https://avatars.githubusercontent.com/u/52690421',NULL,0,0,'2024-07-04 11:01:01.421721','2024-07-04 11:01:01.421721'),(12,'root','96e79218965eb72c92a549dd5a330112','莫子豪','Leo_Kunze@yahoo.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/360.jpg','052-50993786',0,1,'2024-07-04 11:01:01.435807','2024-07-04 11:01:01.435807'),(13,'sherrimccl','e3ceb5881a0a1fdaad01296d7554868d','百梓馨','Icie34@gmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1147.jpg',NULL,0,0,'2024-07-04 11:01:01.448607','2024-07-04 11:01:01.448607'),(14,'maureencri','e3ceb5881a0a1fdaad01296d7554868d','淳于家明','Emile.Von3@yahoo.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/53.jpg',NULL,0,0,'2024-07-04 11:01:01.460622','2024-07-04 11:01:01.460622'),(15,'dougwiegan','e3ceb5881a0a1fdaad01296d7554868d','左伟','Gisselle_Terry94@hotmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/303.jpg',NULL,0,0,'2024-07-04 11:01:01.472966','2024-07-04 11:01:01.472966'),(16,'missnancyh','e3ceb5881a0a1fdaad01296d7554868d','寸佳琪','Zachary78@yahoo.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/866.jpg',NULL,0,0,'2024-07-04 11:01:01.484834','2024-07-04 11:01:01.484834'),(18,'myronrohan','e3ceb5881a0a1fdaad01296d7554868d','永桂兰','Jarvis5@gmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/796.jpg',NULL,0,0,'2024-07-04 11:01:01.509206','2024-07-04 11:01:01.509206'),(19,'annekessle','e3ceb5881a0a1fdaad01296d7554868d','越雪','Hellen_Pfannerstill@yahoo.com','https://avatars.githubusercontent.com/u/10439586',NULL,0,0,'2024-07-04 11:01:01.521316','2024-07-04 11:01:01.521316'),(20,'clayoberbr','e3ceb5881a0a1fdaad01296d7554868d','沐艺涵','Joshua.Kemmer@gmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/310.jpg',NULL,0,0,'2024-07-04 11:01:01.533300','2024-07-04 11:01:01.533300'),(21,'dr.darinmc','e3ceb5881a0a1fdaad01296d7554868d','蹉丽','Idella.OKeefe65@gmail.com','https://avatars.githubusercontent.com/u/24622763',NULL,0,0,'2024-07-04 11:01:01.562071','2024-07-04 11:01:01.562071'),(22,'virginiaha','e3ceb5881a0a1fdaad01296d7554868d','蔺国平','Blanche_Harris94@gmail.com','https://avatars.githubusercontent.com/u/99421839',NULL,0,0,'2024-07-04 11:01:01.573797','2024-07-04 11:01:01.573797'),(23,'mitchellgi','e3ceb5881a0a1fdaad01296d7554868d','成梓诚','Arne_Gibson@gmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/653.jpg',NULL,0,0,'2024-07-04 11:01:01.585094','2024-07-04 11:01:01.585094'),(24,'cherylproh','e3ceb5881a0a1fdaad01296d7554868d','墨超','Karson_Cummerata@gmail.com','https://avatars.githubusercontent.com/u/31465687',NULL,0,0,'2024-07-04 11:01:01.595952','2024-07-04 11:01:01.595952'),(25,'kathykrajc','e3ceb5881a0a1fdaad01296d7554868d','涂倩','Imani.Bashirian33@hotmail.com','https://avatars.githubusercontent.com/u/51173032',NULL,1,0,'2024-07-04 11:01:01.608037','2024-07-04 11:01:01.608037'),(26,'ernesthale','e3ceb5881a0a1fdaad01296d7554868d','礼万佳','Ansley24@gmail.com','https://avatars.githubusercontent.com/u/11323780',NULL,0,0,'2024-07-04 11:01:01.619779','2024-07-04 11:01:01.619779'),(27,'doloresabs','e3ceb5881a0a1fdaad01296d7554868d','营智杰','Raegan_Rippin13@hotmail.com','https://avatars.githubusercontent.com/u/98065236',NULL,0,0,'2024-07-04 11:01:01.632842','2024-07-04 11:01:01.632842'),(28,'betsymitch','e3ceb5881a0a1fdaad01296d7554868d','燕超栋','Anabelle82@hotmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/613.jpg',NULL,0,0,'2024-07-04 11:01:01.646021','2024-07-04 11:01:01.646021'),(29,'omarbode','e3ceb5881a0a1fdaad01296d7554868d','旁浩晨','Columbus.Luettgen@hotmail.com','https://avatars.githubusercontent.com/u/32430073',NULL,0,0,'2024-07-04 11:01:01.658090','2024-07-04 11:01:01.658090'),(30,'tonydietri','e3ceb5881a0a1fdaad01296d7554868d','饶安琪','Zack91@hotmail.com','https://avatars.githubusercontent.com/u/68956391',NULL,0,0,'2024-07-04 11:01:01.670635','2024-07-04 11:01:01.670635'),(31,'percydaugh','e3ceb5881a0a1fdaad01296d7554868d','娄雯静','Easter.Batz92@gmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/905.jpg',NULL,0,0,'2024-07-04 11:01:01.681625','2024-07-04 11:01:01.681625'),(32,'mr.kenthan','e3ceb5881a0a1fdaad01296d7554868d','居国华','Nellie14@gmail.com','https://avatars.githubusercontent.com/u/3625196',NULL,0,0,'2024-07-04 11:01:01.693809','2024-07-04 11:01:01.693809'),(33,'sharifries','e3ceb5881a0a1fdaad01296d7554868d','丑万佳','Jerrod71@hotmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/561.jpg',NULL,1,0,'2024-07-04 11:01:01.704273','2024-07-04 11:01:01.704273'),(34,'misslanada','96e79218965eb72c92a549dd5a330112','包雅鑫','Domenic.Herman@hotmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/863.jpg','17037575239',0,1,'2024-07-04 11:01:01.715215','2024-07-04 11:01:01.715215'),(35,'emiliocron','e3ceb5881a0a1fdaad01296d7554868d','褒静怡','Delmer_Trantow71@yahoo.com','https://avatars.githubusercontent.com/u/43184604',NULL,0,0,'2024-07-04 11:01:01.725422','2024-07-04 11:01:01.725422'),(36,'lutherlebs','e3ceb5881a0a1fdaad01296d7554868d','充国荣','Germaine.Orn65@gmail.com','https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/8.jpg',NULL,0,0,'2024-07-04 11:01:01.736516','2024-07-04 11:01:01.736516');",
    );
    await queryRunner.query(
      "INSERT INTO `meeting_room` VALUES (1,'木星',19,'迮桥473号','椅子','',0,'2024-07-04 11:01:41.408683','2024-07-04 11:01:41.408683'),(2,'火星',13,'昔侬9号','薯条','',0,'2024-07-04 11:01:41.408683','2024-07-04 11:01:41.408683'),(3,'地球',23,'阙桥56535号','球','',0,'2024-07-04 11:01:41.408683','2024-07-04 11:01:41.408683');",
    );
    await queryRunner.query(
      "INSERT INTO `booking` VALUES (1,'2024-07-04 19:11:54','2024-07-04 20:11:54','apply','','2024-07-04 11:11:54.176399','2024-07-04 11:11:54.176399',1,3),(2,'2024-07-04 19:11:54','2024-07-04 20:11:54','apply','','2024-07-04 11:11:54.195406','2024-07-04 11:11:54.195406',2,NULL),(3,'2024-07-04 19:11:54','2024-07-04 20:11:54','apply','','2024-07-04 11:11:54.210328','2024-07-04 11:11:54.210328',2,3),(4,'2024-07-04 19:11:54','2024-07-04 20:11:54','apply','','2024-07-04 11:11:54.223883','2024-07-04 11:11:54.223883',1,NULL);",
    );
    await queryRunner.query(
      "INSERT INTO `permissions` VALUES (1,'ccc','访问 ccc 接口'),(2,'ddd','访问 ddd 接口');",
    );
    await queryRunner.query(
      "INSERT INTO `roles` VALUES (1,'管理员'),(2,'普通用户');",
    );
    await queryRunner.query(
      'INSERT INTO `role_permissions` VALUES (1,1),(1,2);',
    );
    await queryRunner.query(
      'INSERT INTO `user_roles` VALUES (1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2),(11,2),(12,1),(13,2),(14,2),(15,2),(16,2),(18,2),(19,2),(20,2),(21,2),(22,2),(23,2),(24,2),(25,2),(26,2),(27,2),(28,2),(29,2),(30,2),(31,2),(32,2),(33,2),(34,1),(35,2),(36,2);',
    );
  }

  // 如果执行失败恢复 down 部分如果你想 revert 的话也可以写一下，就是 insert into 的反义词 delete from，或者直接 truncate table 清空数据。
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE booking');
  }
}