// DI token 单独放一个文件：controller 从 module 导入会形成循环引用
// （module 也要导入 controller），Nest 解析依赖时会拿到 undefined。
export const OSS_CLIENT = 'OSS_CLIENT';
