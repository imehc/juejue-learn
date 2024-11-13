import { BookApi, ResponseError } from '~/book-management-system-api'
import { apiInstance } from '~/utils/api'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const file = formData.get('file') as Blob | null
    if (!file) throw createError({
      statusCode: 400,
      message: '没有选择文件',
      fatal: true,
    })

    const bookApi = apiInstance(BookApi)
    const path = await bookApi.uploadBookImage({ file })
    return { path }
  }
  catch (error) {
    if (error instanceof ResponseError) {
      const response = await error.response.json()
      throw createError({
        statusCode: 400,
        message: response.message,
        fatal: true,
      })
    }
  }
})
