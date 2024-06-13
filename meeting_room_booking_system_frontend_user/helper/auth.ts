import { ACCESS_TOKEN, getAuthCookie } from "./cookie";

import {
  BASE_PATH,
  Configuration,
  ConfigurationParameters,
} from "@/meeting-room-booking-api";

export function apiInstance<T extends new (conf?: Configuration) => any>(
  Api: T,
  conf?: ConfigurationParameters,
): InstanceType<T> {
  const accessToken = getAuthCookie(ACCESS_TOKEN);
  const _conf = new Configuration({
    basePath: process.env.API_SERVER || BASE_PATH,
    accessToken,
    headers: conf?.headers,
    ...conf,
  });

  const instance: InstanceType<T> = new Api(_conf);

  return instance;
}
