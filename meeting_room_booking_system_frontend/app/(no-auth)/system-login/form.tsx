"use client";

import { useActionState, useEffect } from "react";
import { Input, Divider, Button } from "@nextui-org/react";

import { systemLoginAction } from "./actions";

import { parseResult } from "@/helper/parse";

export function SystemLoginForm() {
  const [loginState, loginFormAction, isPending] = useActionState(
    systemLoginAction,
    {},
  );

  useEffect(() => {
    parseResult(loginState);
  }, [loginState]);

  return (
    <form action="" autoComplete="off" className="w-full">
      <Input
        isRequired
        required
        autoComplete="on"
        className="max-w-sm mb-4"
        errorMessage={loginState?.validationErrors?.username?.join(" ")}
        isInvalid={!!loginState?.validationErrors?.username?.length}
        label="用户名"
        name="username"
        type="text"
      />
      <Input
        isRequired
        required
        autoComplete="on"
        className="max-w-sm mb-4"
        errorMessage={loginState?.validationErrors?.password?.join(" ")}
        isInvalid={!!loginState?.validationErrors?.password?.length}
        label="密码"
        name="password"
        type="password"
      />
      <Divider className="mb-4" />
      <Button
        fullWidth
        className="max-w-sm"
        color="primary"
        formAction={loginFormAction}
        isDisabled={isPending}
        type="submit"
      >
        {isPending ? "登录中..." : "登录"}
      </Button>
    </form>
  );
}
