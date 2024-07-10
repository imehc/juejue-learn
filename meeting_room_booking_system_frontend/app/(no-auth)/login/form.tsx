"use client";

import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { Link } from "@nextui-org/link";
import { Button, ButtonProps } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { useEffect } from "react";
import { toast } from "sonner";

import { login } from "./actions";

import { GithubIcon, GoogleIcon } from "@/components/icons";

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
        <Link href="/register" underline="hover">
          创建账号
        </Link>
        <Link href="/forgot-password" underline="hover">
          忘记密码
        </Link>
      </div>
      <Divider className="mb-4" />
      <SubmitButton formAction={loginFormAction} />
      {/* 使用next可以使用next-auth来进行第三方登录 */}
      <Button
        fullWidth
        as={Link}
        className="mt-4"
        color="default"
        // 没有固定ip地址或域名之前，暂时先暴露改端口以支持第三方登录
        href="http://localhost:6020/user/google"
        startContent={<GoogleIcon />}
        variant="bordered"
      >
        Signin with Google
      </Button>
      <Button
        fullWidth
        as={Link}
        className="mt-4"
        color="default"
        // 没有固定ip地址或域名之前，暂时先暴露改端口以支持第三方登录
        href="http://localhost:6020/user/github"
        startContent={<GithubIcon />}
        variant="bordered"
      >
        Signin with Github
      </Button>
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
