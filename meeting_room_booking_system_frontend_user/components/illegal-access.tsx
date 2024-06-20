"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

export const IllegalAccess: FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.back();
  }, []);

  return null;
};
