"use client";

import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { Link } from "@nextui-org/link";
import { Button, ButtonProps } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { useEffect, useState } from "react";
import { useCountDown } from "ahooks";
import { useRouter } from "next/navigation";

import { registerAction, registerCaptchaAction } from "./actions";

import { parseResult } from "@/helper/parse-result";

export function RegisterForm() {
  const router = useRouter();
  const [registerState, registerFormAction] = useFormState(registerAction, {});
  const [registerCaptchaState, registerCaptchaFormAction] = useFormState(
    registerCaptchaAction,
    {},
  );

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
        <SendCaptchaButton
          countDown={countDown}
          formAction={registerCaptchaFormAction}
        />
      </div>
      <div className="w-full mb-4 text-end">
        <span>已有账号？去</span>
        <Link href="/login" underline="hover">
          登录
        </Link>
      </div>
      <Divider className="mb-4" />
      <SubmitButton formAction={registerFormAction} />
    </form>
  );
}

function SendCaptchaButton({
  countDown,
  ...props
}: ButtonProps & { countDown: number }) {
  const { pending } = useFormStatus();

  return (
    <Button
      fullWidth
      className="col-span-2 h-14"
      color="primary"
      isDisabled={pending || countDown !== 0}
      type="submit"
      {...props}
    >
      {countDown === 0 ? "发送验证码" : `剩余${Math.round(countDown / 1000)}秒`}
    </Button>
  );
}

function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus();

  // TODO: 点击发送验证码不触发pending
  return (
    <Button
      fullWidth
      className="max-w-sm"
      color="primary"
      isDisabled={pending}
      type="submit"
      {...props}
    >
      {pending ? "注册中..." : "注册"}
    </Button>
  );
}
