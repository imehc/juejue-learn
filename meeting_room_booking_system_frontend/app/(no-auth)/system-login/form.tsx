"use client";

import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { useEffect } from "react";

import { systemLoginAction } from "./actions";

import { parseResult } from "@/helper/parse-result";

export function SystemLoginForm() {
  const [loginState, loginFormAction] = useFormState(systemLoginAction, {});

  useEffect(() => {
    parseResult(loginState);
  }, [loginState]);

  return (
    <form action="" autoComplete="off" className="w-full">
      <Input
        isRequired
        required
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
        className="max-w-sm mb-4"
        errorMessage={loginState?.validationErrors?.password?.join(" ")}
        isInvalid={!!loginState?.validationErrors?.password?.length}
        label="密码"
        name="password"
        type="password"
      />
      <Divider className="mb-4" />
      <SubmitButton formAction={loginFormAction} />
    </form>
  );
}

function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      fullWidth
      className="max-w-sm"
      color="primary"
      isDisabled={pending}
      type="submit"
      {...props}
    >
      {pending ? "登录中..." : "登录"}
    </Button>
  );
}
