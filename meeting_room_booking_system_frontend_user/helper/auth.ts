import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { ACCESS_TOKEN } from "./cookie";

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
  const accessToken = cookies().get(ACCESS_TOKEN)?.value;

  const _conf = new Configuration({
    basePath: process.env.API_SERVER || BASE_PATH,
    accessToken,
    headers: conf?.headers,
    middleware: [middleware],
    ...conf,
  });

  const instance: InstanceType<T> = new Api(_conf);

  return instance;
}

const middleware: Middleware = {
  async post(context: ResponseContext): Promise<Response | void> {
    if (context.response.ok) {
      return;
    }
    switch (context.response.status) {
      case 500:
        throw new Error("服务异常，请稍后重试");

      case 401: {
        try {
          //TODO: 待解决：由于不能同步更新设置新的cookie，所以这里直接跳转到登陆，否则当token过期后每次都要请求一变
          // const auth = await refreshTokenAction();
          // const headers: HeadersInit = {
          //   Authorization: `Bearer ${auth?.accessToken}`,
          // };

          // context.init.headers = { ...context.init.headers, ...headers };

          // return await context.fetch(context.url, context.init);

          throw new Error();
        } catch (error) {
          return redirect("/login");
        }
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
  },
};

const jsonRegex = new RegExp(
  "^(:?application/json|[^;/ \\t]+/[^;/ \\t]+[+]json)[ \\t]*(:?;.*)?$",
  "i",
);

function isJson(text?: string | null) {
  return !!text && jsonRegex.test(text);
}
