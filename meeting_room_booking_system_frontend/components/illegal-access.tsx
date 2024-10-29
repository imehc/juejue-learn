"use client";

import { useRouter } from "next-nprogress-bar";
import { FC, useEffect } from "react";

export const IllegalAccess: FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.back();
  }, []);

  return null;
};
