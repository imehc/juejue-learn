"use client";

import { useEffect } from "react";

import { clearCookie } from "~/app/(no-auth)/login/actions";

/** 清除当前页面Auth相关cookie */
export const EmptyCookie = () => {
  useEffect(() => {
    clearCookie();
  }, []);

  return null;
};
