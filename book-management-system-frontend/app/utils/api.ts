import { BASE_PATH, Configuration, type ConfigurationParameters } from '~~/book-management-system-api'

export const USERNAME = 'username'

export function apiInstance<T extends new (conf?: Configuration) => InstanceType<T>>(
  Api: T,
  conf?: ConfigurationParameters,
) {
  const accessToken = ''

  const _conf = new Configuration({
    basePath: process.env.API_SERVER || BASE_PATH,
    accessToken,
    headers: conf?.headers,
    ...conf,
  })

  const instance: InstanceType<T> = new Api(_conf)

  return instance
}
