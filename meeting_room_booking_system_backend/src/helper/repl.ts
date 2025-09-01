import { repl } from '@nestjs/core';
import { AppModule } from 'src/app.module';

/**
 * ``` bash
 * pnpm repl
 * ```
 * 启动完成后输入`methods(Service名称)`,如`methods(MeetingRoomServiceMock)`,随后会列出相应的可执行的方法名称.
 *
 * 调用该方法`await get(Service名称).方法名称()`,如`await get(MeetingRoomServiceMock).mockMeetingRoom()`即可执行该方法.
 */
async function bootstrap() {
  const replServer = await repl(AppModule);
  replServer.setupHistory('.nestjs_repl_history', (err) => {
    if (err) {
      console.error(err);
    }
  });
}

bootstrap().catch((error) => {
  console.error('app.listen error:', error);
});
