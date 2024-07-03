"use client";

import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { Link } from "@nextui-org/link";
import { Button, ButtonProps } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCountDown } from "ahooks";
import { useRouter } from "next/navigation";

import { register, registerCaptcha } from "./actions";

export function RegisterForm() {
  const router = useRouter();
  const [registerState, registerFormAction] = useFormState(register, {
    message: null,
  });
  const [registerCaptchaState, registerCaptchaFormAction] = useFormState(
    registerCaptcha,
    { message: null },
  );

  const [targetDate, setTargetDate] = useState<number>();
  const [countDown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  useEffect(() => {
    if (!registerState?.error) return;
    toast.error(registerState.error);
  }, [registerState]);

  useEffect(() => {
    if (!registerState?.success) return;
    toast.success(registerState.success);
    router.replace("/login");
  }, [registerState]);

  useEffect(() => {
    if (!registerCaptchaState?.error) return;
    toast.error(registerCaptchaState.error);
  }, [registerCaptchaState]);

  useEffect(() => {
    if (!registerCaptchaState?.success) return;
    setTargetDate(Date.now() + 60 * 1000);
    toast.success(registerCaptchaState.success);
  }, [registerCaptchaState]);

  return (
    <form action="" autoComplete="off" className="w-full">
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={registerState?.message?.username}
        isInvalid={!!registerState?.message?.username}
        label="用户名"
        name="username"
        type="text"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={registerState?.message?.nickName}
        isInvalid={!!registerState?.message?.nickName}
        label="昵称"
        name="nickName"
        type="text"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={registerState?.message?.password}
        isInvalid={!!registerState?.message?.password}
        label="密码"
        name="password"
        type="password"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={registerState?.message?.confirmPassword}
        isInvalid={!!registerState?.message?.confirmPassword}
        label="确认密码"
        name="confirmPassword"
        type="password"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={registerState?.message?.email}
        isInvalid={!!registerState?.message?.email}
        label="邮箱"
        name="email"
        type="email"
      />
      <div className="max-w-sm grid grid-cols-6 gap-4 mb-4">
        <Input
          fullWidth
          isRequired
          className="col-span-4"
          errorMessage={registerState?.message?.captcha}
          isInvalid={!!registerState?.message?.captcha}
          label="验证码"
          name="captcha"
          type="number"
        />
        <SendCaptchaButton
          countDown={countDown}
          formAction={registerCaptchaFormAction}
        />
      </div>
      <div className="w-full text-end mb-4">
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
