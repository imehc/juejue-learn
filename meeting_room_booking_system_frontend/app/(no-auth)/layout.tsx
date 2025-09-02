import type { PropsWithChildren } from "react";

import { EmptyCookie } from "~/components/empty-cookie";

export default async function NoAuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-96 mx-auto mt-24 mb-0 flex flex-col justify-start items-center">
      <h1 className="text-center text-2xl font-bold mb-4">会议室预订系统</h1>
      {children}
      <EmptyCookie />
    </div>
  );
}
