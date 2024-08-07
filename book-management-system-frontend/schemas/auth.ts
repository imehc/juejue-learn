import { z } from 'zod'

const authSchema = z.object({
  username: z.string({ required_error: '请输入用户名' }).trim().min(1, '请输入用户名').max(8, '最多为8位'),
  password: z.string({ required_error: '请输入密码' }).trim().min(1, '请输入密码').min(6, '最少为6位').max(16, '最多为16位'),
})

type AuthSchemaValue = z.infer<typeof authSchema>

export { authSchema, type AuthSchemaValue }
