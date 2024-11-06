"use client";

import { useActionState, useEffect } from "react";
import { Button, Divider, Input, Link } from "@nextui-org/react";

import { loginAction } from "./actions";

import { GithubIcon, GoogleIcon } from "@/components/icons";
import { parseResult } from "@/helper/parse";

export function LoginForm() {
  const [loginState, loginFormAction, isPending] = useActionState(
    loginAction,
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
      <div className="flex items-center justify-between w-full mb-4">
        <Link href="/register" underline="hover">
          创建账号
        </Link>
        <Link href="/forgot-password" underline="hover">
          忘记密码
        </Link>
      </div>
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
      {/* 使用next可以使用next-auth来进行第三方登录 */}
      <Button
        fullWidth
        as={Link}
        className="mt-4"
        color="default"
        // 没有固定ip地址或域名之前，暂不支持第三方登录
        href="http://localhost:6020/user/google"
        startContent={<GoogleIcon />}
        variant="bordered"
        isDisabled={process.env.NODE_ENV === "production"}
      >
        Signin with Google
      </Button>
      <Button
        fullWidth
        as={Link}
        className="mt-4"
        color="default"
        // 没有固定ip地址或域名之前，暂不支持第三方登录
        href="http://localhost:6020/user/github"
        startContent={<GithubIcon />}
        variant="bordered"
        isDisabled={process.env.NODE_ENV === "production"}
      >
        Signin with Github
      </Button>
    </form>
  );
}
