import { BookApi, ResponseError } from '~/book-management-system-api'
import { apiInstance } from '~/utils/api'

export default defineEventHandler(async () => {
  try {
    const bookApi = apiInstance(BookApi)
    return await bookApi.findAllBooks()
  }
  catch (error) {
    if (error instanceof ResponseError) {
      const response = await error.response.json()
      throw createError({
        statusCode: 500,
        statusMessage: response.message,
        fatal: true,
      })
    }
  }
})
