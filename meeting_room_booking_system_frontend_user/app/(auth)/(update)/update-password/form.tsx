"use client";

import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCountDown } from "ahooks";

import { updatePassword, updatePasswordCaptcha } from "./actions";

import { UserDetailVo } from "@/meeting-room-booking-api";

export function UpdatePasswordForm({ email }: UserDetailVo) {
  const [updatePasswordState, updatePasswordFormAction] = useFormState(
    updatePassword,
    {
      message: null,
    },
  );
  const [updatePasswordCaptchaState, updatePasswordCaptchaFormAction] =
    useFormState(updatePasswordCaptcha, { message: null });

  const [targetDate, setTargetDate] = useState<number>();
  const [countDown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  useEffect(() => {
    if (!updatePasswordState?.error) return;
    toast.error(updatePasswordState.error);
  }, [updatePasswordState]);

  useEffect(() => {
    if (!updatePasswordState?.success) return;
    toast.success(updatePasswordState.success);
  }, [updatePasswordState]);

  useEffect(() => {
    if (!updatePasswordCaptchaState?.error) return;
    toast.error(updatePasswordCaptchaState.error);
  }, [updatePasswordCaptchaState]);

  useEffect(() => {
    if (!updatePasswordCaptchaState?.success) return;
    setTargetDate(Date.now() + 60 * 1000);
    toast.success(updatePasswordCaptchaState.success);
  }, [updatePasswordCaptchaState]);

  return (
    <form action="" autoComplete="off" className="w-full">
      <Input
        isDisabled
        readOnly
        className="max-w-sm mb-4"
        defaultValue={email}
        label="邮箱"
        name="email"
        type="email"
      />
      <div className="max-w-sm grid grid-cols-6 gap-4 mb-4">
        <Input
          fullWidth
          isRequired
          className="col-span-4"
          errorMessage={updatePasswordState?.message?.captcha}
          isInvalid={!!updatePasswordState?.message?.captcha}
          label="验证码"
          name="captcha"
          type="number"
        />
        <SendCaptchaButton
          countDown={countDown}
          formAction={updatePasswordCaptchaFormAction}
        />
      </div>
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={updatePasswordState?.message?.password}
        isInvalid={!!updatePasswordState?.message?.password}
        label="新密码"
        name="password"
        type="password"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={updatePasswordState?.message?.confirmPassword}
        isInvalid={!!updatePasswordState?.message?.confirmPassword}
        label="确认密码"
        name="confirmPassword"
        type="password"
      />

      <Divider className="mb-4" />
      <SubmitButton formAction={updatePasswordFormAction} />
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
