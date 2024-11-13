import type { Book } from '~/book-management-system-api'
import { BookApi, ResponseError } from '~/book-management-system-api'
import { apiInstance } from '~/utils/api'

export default defineEventHandler(async (event) => {
  try {
    const book: Book = await readBody(event)
    const bookApi = apiInstance(BookApi)
    await bookApi.createBook({ book })
    setResponseStatus(event, 201)
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
