import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { SocksProxyAgent } from 'socks-proxy-agent';

/** 配置代理 */
const Agent = new SocksProxyAgent(
  process.env.SOCKS5_PROXY || 'socks5://127.0.0.1:7890',
);

/**
 * docs https://console.cloud.google.com/apis/credentials
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('google_login_client_id'),
      clientSecret: configService.get('google_login_client_secret'),
      callbackURL: configService.get('google_login_callback_url'),
      scope: ['email', 'profile'],
    });
    this._oauth2.setAgent(Agent);
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    return user;
  }
}
