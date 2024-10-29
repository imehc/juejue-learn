"use client";

import { Button, Divider, Input } from "@nextui-org/react";
import { useActionState, useEffect, useState } from "react";
import { useCountDown } from "ahooks";

import { forgotPasswordAction, forgotPasswordCaptchaAction } from "./actions";

import { parseResult } from "@/helper/parse";

export function ForgotPasswordForm() {
  const [
    forgotPasswordState,
    forgotPasswordFormAction,
    isPendingWithForgotPassword,
  ] = useActionState(forgotPasswordAction, {});
  const [
    forgotPasswordCaptchaState,
    forgotPasswordCaptchaFormAction,
    isPendingWithForgotPasswordCaptcha,
  ] = useActionState(forgotPasswordCaptchaAction, {});

  const [targetDate, setTargetDate] = useState<number>();
  const [countDown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  useEffect(() => {
    parseResult(forgotPasswordState);
  }, [forgotPasswordState]);

  useEffect(() => {
    parseResult(forgotPasswordCaptchaState, () => {
      setTargetDate(Date.now() + 60 * 1000);
    });
  }, [forgotPasswordCaptchaState]);

  return (
    <form action="" autoComplete="off" className="w-full">
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={forgotPasswordState?.validationErrors?.username?.join(
          " ",
        )}
        isInvalid={!!forgotPasswordState?.validationErrors?.username?.length}
        label="用户名"
        name="username"
        type="text"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={
          forgotPasswordState?.validationErrors?.email?.join(" ") ||
          forgotPasswordCaptchaState.validationErrors?.email?.join(" ")
        }
        isInvalid={
          !!forgotPasswordState?.validationErrors?.email?.length ||
          !!forgotPasswordCaptchaState.validationErrors?.email?.length
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
          errorMessage={forgotPasswordState?.validationErrors?.captcha?.join(
            " ",
          )}
          isInvalid={!!forgotPasswordState?.validationErrors?.captcha?.length}
          label="验证码"
          name="captcha"
          type="number"
        />
        <Button
          fullWidth
          className="col-span-2 h-14"
          color="primary"
          formAction={forgotPasswordCaptchaFormAction}
          isDisabled={isPendingWithForgotPasswordCaptcha || countDown !== 0}
          type="submit"
        >
          {countDown === 0
            ? "发送验证码"
            : `剩余${Math.round(countDown / 1000)}秒`}
        </Button>
      </div>
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={forgotPasswordState?.validationErrors?.password?.join(
          " ",
        )}
        isInvalid={!!forgotPasswordState?.validationErrors?.password?.length}
        label="新密码"
        name="password"
        type="password"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        errorMessage={forgotPasswordState?.validationErrors?.confirmPassword?.join(
          " ",
        )}
        isInvalid={
          !!forgotPasswordState?.validationErrors?.confirmPassword?.length
        }
        label="确认密码"
        name="confirmPassword"
        type="password"
      />

      <Divider className="mb-4" />
      <Button
        fullWidth
        className="max-w-sm"
        color="primary"
        formAction={forgotPasswordFormAction}
        isDisabled={isPendingWithForgotPassword}
        type="submit"
      >
        {isPendingWithForgotPassword ? "修改中..." : "修改"}
      </Button>
    </form>
  );
}
