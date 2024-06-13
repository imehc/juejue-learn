"use client";

import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { Link } from "@nextui-org/link";
import { Button, ButtonProps } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { useEffect } from "react";
import { toast } from "sonner";

import { login } from "./actions";

export function LoginForm() {
  const [loginState, loginFormAction] = useFormState(login, { message: null });

  useEffect(() => {
    if (!loginState?.error) return;
    toast.error(loginState.error);
  }, [loginState]);

  return (
    <form action="" autoComplete="off" className="w-full">
      <Input
        isRequired
        required
        className="max-w-sm mb-4"
        errorMessage={loginState?.message?.username}
        isInvalid={!!loginState?.message?.username}
        label="用户名"
        name="username"
        type="text"
      />
      <Input
        isRequired
        required
        className="max-w-sm mb-4"
        errorMessage={loginState?.message?.password}
        isInvalid={!!loginState?.message?.password}
        label="密码"
        name="password"
        type="password"
      />
      <div className="flex w-full justify-between items-center mb-4">
        <Link href="#" underline="hover">
          创建账号
        </Link>
        <Link href="#" underline="hover">
          忘记密码
        </Link>
      </div>
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
      disabled={pending}
      type="submit"
      {...props}
    >
      {pending ? "登录中..." : "登录"}
    </Button>
  );
}
