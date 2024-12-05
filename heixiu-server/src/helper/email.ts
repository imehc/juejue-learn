export type CaptchaType = 'register' | 'login' | 'forget-password';
/** 发送邮件的类型 */
export function getCaptchaType(type: CaptchaType) {
  switch (type) {
    case 'register':
      return '感谢您注册Heixiu聊天室！';
    case 'forget-password':
      return '您正在重置密码！';
    case 'login':
      return '您正在登录Heixiu聊天室！';
    default:
      return '感谢您的使用！';
  }
}