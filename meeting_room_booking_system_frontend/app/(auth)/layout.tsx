import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { Link } from "@nextui-org/link";

import { ACCESS_TOKEN } from "@/helper/cookie";
import { Navbar } from "@/components/navbar";

export default function AuthLayout({ children }: PropsWithChildren) {
  if (!cookies().has(ACCESS_TOKEN)) {
    redirect("/login");
  }

  return (
    <div className="w-screen relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">NextUI</p>
        </Link>
      </footer>
    </div>
  );
}
