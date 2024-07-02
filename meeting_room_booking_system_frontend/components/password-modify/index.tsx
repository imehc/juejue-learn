"use client";

import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCountDown } from "ahooks";

import { passwordModify, passwordModifyCaptcha } from "./actions";

import { UserDetailVo } from "@/meeting-room-booking-api";

export function PasswordModifyForm({ email }: UserDetailVo) {
  const [passwordModifyState, passwordModifyFormAction] = useFormState(
    passwordModify,
    {
      message: null,
    },
  );
  const [passwordModifyCaptchaState, passwordModifyCaptchaFormAction] =
    useFormState(passwordModifyCaptcha, { message: null });

  const [targetDate, setTargetDate] = useState<number>();
  const [countDown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  useEffect(() => {
    if (!passwordModifyState?.error) return;
    toast.error(passwordModifyState.error);
  }, [passwordModifyState]);

  useEffect(() => {
    if (!passwordModifyState?.success) return;
    toast.success(passwordModifyState.success);
  }, [passwordModifyState]);

  useEffect(() => {
    if (!passwordModifyCaptchaState?.error) return;
    toast.error(passwordModifyCaptchaState.error);
  }, [passwordModifyCaptchaState]);

  useEffect(() => {
    if (!passwordModifyCaptchaState?.success) return;
    setTargetDate(Date.now() + 60 * 1000);
    toast.success(passwordModifyCaptchaState.success);
  }, [passwordModifyCaptchaState]);

  return (
    <form
      action=""
      autoComplete="off"
      className="w-full h-full flex flex-col justify-center items-center"
    >
      <Input
        isDisabled
        readOnly
        className="max-w-sm mb-4"
        defaultValue={email}
        label="邮箱"
        name="email"
        type="email"
      />
      <div className="max-w-sm w-full grid grid-cols-6 gap-4 mb-4">
        <Input
          fullWidth
          isRequired
          className="col-span-4"
          errorMessage={passwordModifyState?.message?.captcha}
          isInvalid={!!passwordModifyState?.message?.captcha}
          label="验证码"
          name="captcha"
          type="number"
        />
        <SendCaptchaButton
          countDown={countDown}
          formAction={passwordModifyCaptchaFormAction}
        />
      </div>
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={passwordModifyState?.message?.password}
        isInvalid={!!passwordModifyState?.message?.password}
        label="新密码"
        name="password"
        type="password"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={passwordModifyState?.message?.confirmPassword}
        isInvalid={!!passwordModifyState?.message?.confirmPassword}
        label="确认密码"
        name="confirmPassword"
        type="password"
      />

      <SubmitButton formAction={passwordModifyFormAction} />
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
