import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { ConfigurationImpl } from 'src/config/configuration-impl';

/** 配置代理 */
const Agent = new SocksProxyAgent(
  process.env.SOCKS5_PROXY || 'socks5://127.0.0.1:7890',
);
/**
 * docs https://github.com/settings/apps
 */
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService<ConfigurationImpl>) {
    super({
      clientID: configService.get('github.login.client-id'),
      clientSecret: configService.get('github.login.client-secret'),
      callbackURL: configService.get('google.login.callback-url'),
      scope: ['public_profile'],
    });
    this._oauth2.setAgent(Agent);
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return profile;
  }
}
