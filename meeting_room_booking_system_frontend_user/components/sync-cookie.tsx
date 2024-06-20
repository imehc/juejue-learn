"use client";

import cookie from "js-cookie";

export const SyncCookie = () => {
  console.log("============client================");
  console.log(cookie.get("access-token"));
  console.log("============client================");

  return null;
};
