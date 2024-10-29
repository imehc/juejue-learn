"use client";

import { useActionState, useEffect, useState } from "react";
import { useCountDown } from "ahooks";
import { useRouter } from "next-nprogress-bar";
import { Button, Divider, Input, Link } from "@nextui-org/react";

import { registerAction, registerCaptchaAction } from "./actions";

import { parseResult } from "@/helper/parse";

export function RegisterForm() {
  const router = useRouter();
  const [registerState, registerFormAction, isPendingWithRegister] =
    useActionState(registerAction, {});
  const [
    registerCaptchaState,
    registerCaptchaFormAction,
    isPendingWithRegisterCaptcha,
  ] = useActionState(registerCaptchaAction, {});

  const [targetDate, setTargetDate] = useState<number>();
  const [countDown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  useEffect(() => {
    parseResult(registerState, () => {
      router.replace("/login");
    });
  }, [registerState]);

  useEffect(() => {
    parseResult(registerCaptchaState, () => {
      setTargetDate(Date.now() + 60 * 1000);
    });
  }, [registerCaptchaState]);

  return (
    <form action="" autoComplete="off" className="w-full">
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={registerState?.validationErrors?.username?.join(" ")}
        isInvalid={!!registerState?.validationErrors?.username?.length}
        label="用户名"
        name="username"
        type="text"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={registerState?.validationErrors?.nickName?.join(" ")}
        isInvalid={!!registerState?.validationErrors?.nickName?.length}
        label="昵称"
        name="nickName"
        type="text"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={registerState?.validationErrors?.password?.join(" ")}
        isInvalid={!!registerState?.validationErrors?.password?.length}
        label="密码"
        name="password"
        type="password"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={registerState?.validationErrors?.confirmPassword?.join(
          " ",
        )}
        isInvalid={!!registerState?.validationErrors?.confirmPassword?.length}
        label="确认密码"
        name="confirmPassword"
        type="password"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={
          registerState?.validationErrors?.email?.join(" ") ||
          registerCaptchaState.validationErrors?.email?.join(" ")
        }
        isInvalid={
          !!registerState?.validationErrors?.email?.length ||
          !!registerCaptchaState.validationErrors?.email?.length
        }
        label="邮箱"
        name="email"
        type="email"
      />
      <div className="grid max-w-sm grid-cols-6 gap-4 mb-4">
        <Input
          fullWidth
          isRequired
          className="col-span-4"
          errorMessage={registerState?.validationErrors?.captcha?.join(" ")}
          isInvalid={!!registerState?.validationErrors?.captcha?.length}
          label="验证码"
          name="captcha"
          type="number"
        />
        <Button
          fullWidth
          className="col-span-2 h-14"
          color="primary"
          formAction={registerCaptchaFormAction}
          isDisabled={isPendingWithRegisterCaptcha || countDown !== 0}
          type="submit"
        >
          {countDown === 0
            ? "发送验证码"
            : `剩余${Math.round(countDown / 1000)}秒`}
        </Button>
      </div>
      <div className="w-full mb-4 text-end">
        <span>已有账号？去</span>
        <Link href="/login" underline="hover">
          登录
        </Link>
      </div>
      <Divider className="mb-4" />
      <Button
        fullWidth
        className="max-w-sm"
        color="primary"
        formAction={registerFormAction}
        isDisabled={isPendingWithRegister}
        type="submit"
      >
        {isPendingWithRegister ? "注册中..." : "注册"}
      </Button>
    </form>
  );
}
