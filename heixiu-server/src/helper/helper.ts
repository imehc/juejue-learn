/** 返回注册验证码结构 */
const registerWrapper = (key: string) => `captcha_register_${key}`;
/** 返回忘记密码验证码结构 */
const forgetPasswordWrapper = (key: string) => `forget_password_captcha_${key}`;
/** 更新邮箱验证码结构 */
const updateEmailWrapper = (key: string) => `update_email_captcha_${key}`;

export { registerWrapper, forgetPasswordWrapper, updateEmailWrapper };
