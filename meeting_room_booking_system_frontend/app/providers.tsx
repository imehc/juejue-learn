"use client";

import { HeroUIProvider } from "@heroui/react";
import { AppProgressBar as ProgressBar, useRouter } from "next-nprogress-bar";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type * as React from "react";
import { Toaster } from "sonner";

// https://github.com/styled-components/styled-components/issues/3731#issuecomment-2192053161
const ThemeProvider = (props: ThemeProviderProps): React.JSX.Element => {
  return NextThemesProvider(props) as React.JSX.Element;
};

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
