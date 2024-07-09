import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './local.strategy';
import { GoogleStrategy } from './google.strategy';
import { GithubStrategy } from './github.strategy';

@Module({
  imports: [UserModule],
  providers: [LocalStrategy, GoogleStrategy, GithubStrategy],
})
export class AuthModule {}
