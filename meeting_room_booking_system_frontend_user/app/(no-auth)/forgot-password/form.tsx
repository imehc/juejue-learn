"use client";

import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCountDown } from "ahooks";

import { forgotPassword, forgotPasswordCaptcha } from "./actions";

export function ForgotPasswordForm() {
  const [forgotPasswordState, forgotPasswordFormAction] = useFormState(
    forgotPassword,
    {
      message: null,
    },
  );
  const [forgotPasswordCaptchaState, forgotPasswordCaptchaFormAction] =
    useFormState(forgotPasswordCaptcha, { message: null });

  const [targetDate, setTargetDate] = useState<number>();
  const [countDown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  useEffect(() => {
    if (!forgotPasswordState?.error) return;
    toast.error(forgotPasswordState.error);
  }, [forgotPasswordState]);

  useEffect(() => {
    if (!forgotPasswordState?.success) return;
    toast.success(forgotPasswordState.success);
  }, [forgotPasswordState]);

  useEffect(() => {
    if (!forgotPasswordCaptchaState?.error) return;
    toast.error(forgotPasswordCaptchaState.error);
  }, [forgotPasswordCaptchaState]);

  useEffect(() => {
    if (!forgotPasswordCaptchaState?.success) return;
    setTargetDate(Date.now() + 60 * 1000);
    toast.success(forgotPasswordCaptchaState.success);
  }, [forgotPasswordCaptchaState]);

  return (
    <form action="" autoComplete="off" className="w-full">
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={forgotPasswordState?.message?.email}
        isInvalid={!!forgotPasswordState?.message?.email}
        label="用户名"
        name="username"
        type="text"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={forgotPasswordState?.message?.email}
        isInvalid={!!forgotPasswordState?.message?.email}
        label="邮箱"
        name="email"
        type="email"
      />
      <div className="max-w-sm grid grid-cols-6 gap-4 mb-4">
        <Input
          fullWidth
          isRequired
          className="col-span-4"
          errorMessage={forgotPasswordState?.message?.captcha}
          isInvalid={!!forgotPasswordState?.message?.captcha}
          label="验证码"
          name="captcha"
          type="number"
        />
        <SendCaptchaButton
          countDown={countDown}
          formAction={forgotPasswordCaptchaFormAction}
        />
      </div>
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={forgotPasswordState?.message?.password}
        isInvalid={!!forgotPasswordState?.message?.password}
        label="新密码"
        name="password"
        type="password"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={forgotPasswordState?.message?.confirmPassword}
        isInvalid={!!forgotPasswordState?.message?.confirmPassword}
        label="确认密码"
        name="confirmPassword"
        type="password"
      />

      <Divider className="mb-4" />
      <SubmitButton formAction={forgotPasswordFormAction} />
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
      {pending ? "修改中..." : "修改"}
    </Button>
  );
}
