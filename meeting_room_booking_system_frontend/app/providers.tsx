"use client";

import { HeroUIProvider } from "@heroui/system";
import { AppProgressBar as ProgressBar, useRouter } from "next-nprogress-bar";
import {
  ThemeProvider ,
  type ThemeProviderProps,
} from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

export type ProvidersProps = ThemeProviderProps;

export function Providers({ children, ...themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider
      className="w-full h-full overflow-hidden flex flex-col justify-center items-center"
      navigate={router.push}
    >
      <ThemeProvider {...themeProps}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </ThemeProvider>
      <Toaster richColors position="top-center" />
      <ProgressBar
        shallowRouting
        color="hsl(var(--heroui-primary) / var(--heroui-primary-opacity, var(--tw-bg-opacity)));"
        height="4px"
        options={{ showSpinner: false }}
      />
    </HeroUIProvider>
  );
}
