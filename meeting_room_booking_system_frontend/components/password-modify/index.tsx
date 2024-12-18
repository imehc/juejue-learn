"use client";

import { useActionState, useEffect, useState } from "react";
import { useCountDown } from "ahooks";
import { Input, Button } from "@nextui-org/react";

import { passwordModifyAction, passwordModifyCaptchaAction } from "./actions";

import { UserDetailVo } from "@/meeting-room-booking-api";
import { parseResult } from "@/helper/parse";

export function PasswordModifyForm({ email }: UserDetailVo) {
  const [
    passwordModifyState,
    passwordModifyFormAction,
    isPendingWithPasswordModify,
  ] = useActionState(passwordModifyAction, {});
  const [
    passwordModifyCaptchaState,
    passwordModifyCaptchaFormAction,
    isPendingWithPasswordModifyCaptcha,
  ] = useActionState(passwordModifyCaptchaAction, {});

  const [targetDate, setTargetDate] = useState<number>();
  const [countDown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  useEffect(() => {
    parseResult(passwordModifyCaptchaState, () => {
      setTargetDate(Date.now() + 60 * 1000);
    });
  }, [passwordModifyCaptchaState]);

  useEffect(() => {
    parseResult(passwordModifyState);
  }, [passwordModifyState]);

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
          className="col-span-4"
          errorMessage={passwordModifyState?.validationErrors?.captcha?.join(
            " ",
          )}
          isInvalid={!!passwordModifyState?.validationErrors?.captcha?.length}
          label="验证码"
          name="captcha"
          type="number"
        />

        <Button
          fullWidth
          className="col-span-2 h-14"
          color="primary"
          formAction={passwordModifyCaptchaFormAction}
          isDisabled={isPendingWithPasswordModifyCaptcha || countDown !== 0}
          type="submit"
        >
          {countDown === 0
            ? "发送验证码"
            : `剩余${Math.round(countDown / 1000)}秒`}
        </Button>
      </div>
      <Input
        isRequired
        autoComplete="on"
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
        autoComplete="on"
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

      <Button
        fullWidth
        className="max-w-sm"
        color="primary"
        formAction={passwordModifyFormAction}
        isDisabled={isPendingWithPasswordModify}
        type="submit"
      >
        {isPendingWithPasswordModify ? "修改中..." : "修改"}
      </Button>
    </form>
  );
}
