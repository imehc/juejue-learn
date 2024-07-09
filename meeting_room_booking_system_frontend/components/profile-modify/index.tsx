"use client";

import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCountDown } from "ahooks";

import { profileModify, profileModifyCaptcha } from "./actions";

import { UserDetailVo } from "@/meeting-room-booking-api";

export function ProfileModifyForm({ headPic, nickName, email }: UserDetailVo) {
  const [profileModifyState, profileModifyFormAction] = useFormState(
    profileModify,
    {
      message: null,
    },
  );
  const [profileModifyCaptchaState, profileModifyCaptchaFormAction] =
    useFormState(profileModifyCaptcha, { message: null });

  const [targetDate, setTargetDate] = useState<number>();
  const [countDown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  useEffect(() => {
    if (!profileModifyState?.error) return;
    toast.error(profileModifyState.error);
  }, [profileModifyState]);

  useEffect(() => {
    if (!profileModifyState?.success) return;
    toast.success(profileModifyState.success);
  }, [profileModifyState]);

  useEffect(() => {
    if (!profileModifyCaptchaState?.error) return;
    toast.error(profileModifyCaptchaState.error);
  }, [profileModifyCaptchaState]);

  useEffect(() => {
    if (!profileModifyCaptchaState?.success) return;
    setTargetDate(Date.now() + 60 * 1000);
    toast.success(profileModifyCaptchaState.success);
  }, [profileModifyCaptchaState]);

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
    if (tempLink) {
      return tempLink;
    }
    if (headPic) {
      if (headPic?.startsWith("http://") || headPic?.startsWith("https://")) {
        return headPic;
      }
      // 由于未使用OSS对象存储，所以使用OSS对象存储后实际访问地址需要调整
      // 这里使用nginx反向代理，需要添加api后缀
      // if (process.env.NODE_ENV === "development") {
      //   return `${BASE_PATH}/${headPic}`;
      // }
      // return `http://localhost/api/${headPic}`;

      // 使用minio OSS对象存储 基本地址可能随minio配置变化而变化
      if (process.env.NODE_ENV === "development") {
        return `http://localhost:9000${headPic}`;
      }

      return `http://localhost/oss${headPic}`;
    }

    return undefined;
  }, [headPic, tempLink]);

  return (
    <form
      action=""
      autoComplete="off"
      className="w-full h-full flex flex-col justify-center items-center"
    >
      <div className="flex justify-center items-center relative mb-4">
        <Avatar
          className="w-20 h-20 text-large text-center"
          disableAnimation={false}
          name={nickName?.slice(0, 2)}
          // src="https://i.pravatar.cc/150?u=a04258114e29026302d"
          src={src}
        />
        <input
          accept=".png,.jpg,.gif,.jpeg"
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
      <div className="max-w-sm w-full grid grid-cols-6 gap-4 mb-4">
        <Input
          fullWidth
          isRequired
          className="col-span-4"
          errorMessage={profileModifyState?.message?.captcha}
          isInvalid={!!profileModifyState?.message?.captcha}
          label="验证码"
          name="captcha"
          type="number"
        />
        <SendCaptchaButton
          countDown={countDown}
          formAction={profileModifyCaptchaFormAction}
        />
      </div>

      <SubmitButton formAction={profileModifyFormAction} />
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
