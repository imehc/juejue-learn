"use client";

import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Avatar } from "@nextui-org/avatar";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCountDown } from "ahooks";

import { updateProfile, updateProfileCaptcha } from "./actions";

import { BASE_PATH, UserDetailVo } from "@/meeting-room-booking-api";

export function UpdateProfileForm({ headPic, nickName, email }: UserDetailVo) {
  const [updateProfileState, updateProfileFormAction] = useFormState(
    updateProfile,
    {
      message: null,
    },
  );
  const [updateProfileCaptchaState, updateProfileCaptchaFormAction] =
    useFormState(updateProfileCaptcha, { message: null });

  const [targetDate, setTargetDate] = useState<number>();
  const [countDown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  useEffect(() => {
    if (!updateProfileState?.error) return;
    toast.error(updateProfileState.error);
  }, [updateProfileState]);

  useEffect(() => {
    if (!updateProfileState?.success) return;
    toast.success(updateProfileState.success);
  }, [updateProfileState]);

  useEffect(() => {
    if (!updateProfileCaptchaState?.error) return;
    toast.error(updateProfileCaptchaState.error);
  }, [updateProfileCaptchaState]);

  useEffect(() => {
    if (!updateProfileCaptchaState?.success) return;
    setTargetDate(Date.now() + 60 * 1000);
    toast.success(updateProfileCaptchaState.success);
  }, [updateProfileCaptchaState]);

  const [file, setFile] = useState<File>();
  const [tempLink, setTempLink] = useState<string>();

  useEffect(() => {
    if (!file) return;
    let l: string | null;

    try {
      l = URL.createObjectURL(file);

      setTempLink(l);
    } catch (error) {
      console.error(error);
    }

    return () => {
      if (!l) return;
      URL.revokeObjectURL(l);
    };
  }, [file]);

  const src = useMemo(() => {
    if (headPic) {
      if (headPic?.startsWith("http://") || headPic?.startsWith("https://")) {
        return headPic;
      }

      return `${BASE_PATH}/${headPic}`;
    }

    return tempLink;
  }, [headPic, tempLink]);

  return (
    <form action="" autoComplete="off" className="w-full">
      <div className="flex justify-center items-center relative mb-4">
        <Avatar
          className="w-20 h-20 text-large text-center"
          disableAnimation={false}
          name={nickName?.slice(0, 2)}
          // src="https://i.pravatar.cc/150?u=a04258114e29026302d"
          src={src}
        />
        <input
          accept=".png,.jpg,.gif"
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-0 cursor-pointer"
          name="picture"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
      </div>
      <Input
        className="max-w-sm mb-4"
        defaultValue={nickName}
        label="昵称"
        name="nickName"
        type="text"
      />
      <Input
        isDisabled
        isRequired
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
          errorMessage={updateProfileState?.message?.captcha}
          isInvalid={!!updateProfileState?.message?.captcha}
          label="验证码"
          name="captcha"
          type="number"
        />
        <SendCaptchaButton
          countDown={countDown}
          formAction={updateProfileCaptchaFormAction}
        />
      </div>

      <Divider className="mb-4" />
      <SubmitButton formAction={updateProfileFormAction} />
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
