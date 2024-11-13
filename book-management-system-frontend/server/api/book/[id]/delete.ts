import { BookApi, ResponseError } from '~/book-management-system-api'
import { apiInstance } from '~/utils/api'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') as string)
    const bookApi = apiInstance(BookApi)
    await bookApi.deleteBook({ id })
    setResponseStatus(event, 204)
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
