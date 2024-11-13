import { z } from 'zod'
import type { BookItem } from '~/book-management-system-api'

const bookSchema = z.object({
  name: z.string({ required_error: '请输入图书名称' }).trim().min(1, '请输入图书名称').max(32, '最多为32位'),
  author: z.string({ required_error: '请输入作者姓名' }).trim().min(1, '请输入作者姓名').max(32, '最多为32位'),
  description: z.string({ required_error: '请输入描述' }).trim().min(1, '请输入描述').max(1000, '最多为1000位'),
  cover: z.string({ required_error: '请上传封面' }).trim().min(1, '请上传封面'),
})

type BookSchemaValue = z.infer<typeof bookSchema>

type IBookItem = BookSchemaValue & Partial<Pick<BookItem, 'id'>>

type IFormType = 'create' | 'update' | 'info'

const initBook = (): IBookItem => ({
  name: '',
  author: '',
  cover: '',
  description: '',
})

export {
  bookSchema,
  type BookSchemaValue,
  type IFormType,
  type IBookItem,
  initBook,
}
