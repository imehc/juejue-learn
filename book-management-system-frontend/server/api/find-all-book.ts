import type { FindAllBooksRequest } from '~/book-management-system-api'
import { BookApi, ResponseError } from '~/book-management-system-api'
import { apiInstance } from '~/utils/api'

export default defineEventHandler(async (event) => {
  try {
    const query: FindAllBooksRequest = getQuery(event)
    const bookApi = apiInstance(BookApi)
    return await bookApi.findAllBooks(query)
  }
  catch (error) {
    if (error instanceof ResponseError) {
      const response = await error.response.json()
      throw createError({
        statusCode: 500,
        message: response.message,
        fatal: true,
      })
    }
  }
})
