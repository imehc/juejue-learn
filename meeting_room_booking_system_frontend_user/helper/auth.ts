import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { ACCESS_TOKEN, REFRESH_TOKEN, getAuthCookie } from "./cookie";

import {
  Auth,
  BASE_PATH,
  Configuration,
  ConfigurationParameters,
  FetchParams,
  Middleware,
  RequestContext,
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
    middleware: [middleware],
    ...conf,
  });

  const instance: InstanceType<T> = new Api(_conf);

  return instance;
}

const middleware: Middleware = {
  async pre(context: RequestContext): Promise<FetchParams | void> {},
  async post(context: ResponseContext): Promise<Response | void> {
    if (context.response.ok) {
      return;
    }
    switch (context.response.status) {
      case 500:
        throw new Error("服务异常，请稍后重试");

      case 401: {
        const refreshToken = cookies().get(REFRESH_TOKEN)?.value;

        if (!refreshToken) {
          return redirect("/login");
        }
        try {
          const res = await fetch(
            `${process.env.__NEXT_PRIVATE_ORIGIN}/api/cookie?${REFRESH_TOKEN}=${refreshToken}`,
          );

          const { accessToken }: Pick<Auth, "accessToken"> = await res.json();
          const headers: HeadersInit = {
            Authorization: `Bearer ${accessToken}`,
          };

          context.init.headers = { ...context.init.headers, ...headers };

          return await context.fetch(context.url, context.init);
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
