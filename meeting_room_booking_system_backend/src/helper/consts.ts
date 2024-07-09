/** 登录权限 */
export const LOGIN_METADATA = 'require-login';
/** 接口访问权限 */
export const PERMISSION_METADATA = 'require-permission';
/** 系统邮件 */
export const ADMIN_EMAIL = 'admin_email';

/** REDIS KEY 修改密码验证码 */
export const UPDATE_PASSWORD_CAPTCHA = (key: string) =>
  `update_password_captcha_${key}`;
/** REDIS KEY 忘记密码验证码 */
export const FORGOT_PASSWORD_CAPTCHA = (key: string) =>
  `forgot_password_captcha_${key}`;
/** REDIS KEY 注册验证码 */
export const REGISTER_CAPTCHA = (key: string) => `register_captcha_${key}`;
/** REDIS KEY 更新信息 */
export const UPDATE_USER_CAPTCHA = (key: string) =>
  `update_user_captcha_${key}`;
/** 催办 */
export const URGE = (key: string) => `urge_${key}`;

export const ACCESS_TOKEN = 'access-token';
export const REFRESH_TOKEN = 'refresh-token';
export const EXPIRES_IN = 'expires-in';
