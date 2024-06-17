import { redirect } from "next/navigation";

import { ACCESS_TOKEN, getAuthCookie } from "./cookie";

import {
  BASE_PATH,
  Configuration,
  ConfigurationParameters,
  Middleware,
  ResponseContext,
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
    middleware: [new IMiddware()],
    ...conf,
  });

  const instance: InstanceType<T> = new Api(_conf);

  return instance;
}

class IMiddware implements Middleware {
  async post(context: ResponseContext) {
    if (!context.response.ok) {
      switch (context.response.status) {
        case 500:
          throw new Error("服务异常，请稍后重试");
        case 401: {
          // 使用refreshToken获取新token
          return redirect("/login");
        }
        case 400: {
          if (isJson(context.response.headers.get("Content-Type"))) {
            const res: { message?: string } = await context.response.json();

            throw new Error(res.message ?? context.response.statusText);
          }

          const text = await context.response.text();

          throw new Error(text);
        }
      }
    }
  }
}

const jsonRegex = new RegExp(
  "^(:?application/json|[^;/ \\t]+/[^;/ \\t]+[+]json)[ \\t]*(:?;.*)?$",
  "i",
);

function isJson(text?: string | null) {
  return !!text && jsonRegex.test(text);
}
