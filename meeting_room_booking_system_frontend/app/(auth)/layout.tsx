import { Link } from "@heroui/react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Navbar } from "~/components/navbar";
import { ACCESS_TOKEN } from "~/helper/cookie";

export default async function AuthLayout({ children }: PropsWithChildren) {
  if (!(await cookies()).has(ACCESS_TOKEN)) {
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
          href="https://heroui.com?utm_source=next-app-template"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
        </Link>
      </footer>
    </div>
  );
}
