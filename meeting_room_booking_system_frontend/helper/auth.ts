import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { ACCESS_TOKEN, basePath } from "./cookie";

import {
  Configuration,
  ConfigurationParameters,
  Middleware,
  ResponseContext,
} from "@/meeting-room-booking-api";

export async function apiInstance<T extends new (conf?: Configuration) => any>(
  Api: T,
  conf?: ConfigurationParameters,
): Promise<InstanceType<T>> {
  const accessToken = (await cookies()).get(ACCESS_TOKEN)?.value;

  const _conf = new Configuration({
    basePath: process.env.API_SERVER || basePath,
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
        // process.env.__NEXT_PRIVATE_ORIGIN
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
  },
};

const jsonRegex = new RegExp(
  "^(:?application/json|[^;/ \\t]+/[^;/ \\t]+[+]json)[ \\t]*(:?;.*)?$",
  "i",
);

function isJson(text?: string | null) {
  return !!text && jsonRegex.test(text);
}
