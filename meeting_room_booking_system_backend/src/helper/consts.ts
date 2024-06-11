/** 登录权限 */
export const LOGIN_METADATA = 'require-login';
/** 接口访问权限 */
export const PERMISSION_METADATA = 'require-permission';

/** REDIS KEY 修改密码验证码 */
export const UPDATE_PASSWORD_CAPTCHA = (key: string) =>
  `update_password_captcha_${key}`;
/** REDIS KEY 注册验证码 */
export const REGISTER_CAPTCHA = (key: string) => `register_captcha_${key}`;
/** REDIS KEY 更新信息 */
export const UPDATE_USER_CAPTCHA = (key: string) =>
  `update_user_captcha_${key}`;
