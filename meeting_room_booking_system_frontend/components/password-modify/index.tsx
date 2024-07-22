"use client";

import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCountDown } from "ahooks";

import { passwordModifyAction, passwordModifyCaptchaAction } from "./actions";

import { UserDetailVo } from "@/meeting-room-booking-api";

export function PasswordModifyForm({ email }: UserDetailVo) {
  const [passwordModifyState, passwordModifyFormAction] = useFormState(
    passwordModifyAction,
    {},
  );
  const [passwordModifyCaptchaState, passwordModifyCaptchaFormAction] =
    useFormState(passwordModifyCaptchaAction, {});

  const [targetDate, setTargetDate] = useState<number>();
  const [countDown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  useEffect(() => {
    if (passwordModifyCaptchaState?.serverError) {
      toast.error(passwordModifyCaptchaState.serverError);

      return;
    }

    if (passwordModifyCaptchaState.data?.message) {
      setTargetDate(Date.now() + 60 * 1000);
      toast.success(passwordModifyCaptchaState.data.message);

      return;
    }

    if (passwordModifyState.serverError) {
      toast.error(passwordModifyState.serverError);

      return;
    }
    if (passwordModifyState.data?.message) {
      toast.success(passwordModifyState.data.message);

      return;
    }
  }, [passwordModifyCaptchaState, passwordModifyState]);

  return (
    <form
      action=""
      autoComplete="off"
      className="flex flex-col items-center justify-center w-full h-full"
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
      <div className="grid w-full max-w-sm grid-cols-6 gap-4 mb-4">
        <Input
          fullWidth
          isRequired
          className="col-span-4"
          errorMessage={passwordModifyState?.validationErrors?.captcha?.join(
            " ",
          )}
          isInvalid={!!passwordModifyState?.validationErrors?.captcha?.length}
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
        errorMessage={passwordModifyState?.validationErrors?.password?.join(
          " ",
        )}
        isInvalid={!!passwordModifyState?.validationErrors?.password?.length}
        label="新密码"
        name="password"
        type="password"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={passwordModifyState?.validationErrors?.confirmPassword?.join(
          " ",
        )}
        isInvalid={
          !!passwordModifyState?.validationErrors?.confirmPassword?.length
        }
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
