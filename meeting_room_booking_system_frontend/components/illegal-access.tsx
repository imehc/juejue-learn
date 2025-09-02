"use client";

import { useRouter } from "next-nprogress-bar";
import { type FC, useEffect } from "react";

export const IllegalAccess: FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.back();
  }, [router.back]);

  return null;
};
