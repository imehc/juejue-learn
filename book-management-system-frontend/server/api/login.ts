import type { User } from '~/book-management-system-api'
import { ResponseError, UserApi } from '~/book-management-system-api'
import { apiInstance } from '~/utils/api'

export default defineEventHandler(async (event) => {
  try {
    const user: User = await readBody(event)
    const userApi = apiInstance(UserApi)
    await userApi.login({ user })
    return setResponseStatus(event, 201)
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
