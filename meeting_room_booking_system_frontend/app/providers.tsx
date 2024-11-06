"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

// https://github.com/styled-components/styled-components/issues/3731#issuecomment-2192053161
const ThemeProvider = (props: ThemeProviderProps): React.JSX.Element => {
  return NextThemesProvider(props) as React.JSX.Element;
};

export type ProvidersProps = ThemeProviderProps;

export function Providers({ children, ...themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider
      className="w-full h-full overflow-hidden flex flex-col justify-center items-center"
      navigate={router.push}
    >
      <ThemeProvider {...themeProps}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </ThemeProvider>
      <Toaster richColors position="top-center" />
      <ProgressBar
        shallowRouting
        color="hsl(var(--nextui-primary) / var(--nextui-primary-opacity, var(--tw-bg-opacity)));"
        height="4px"
        options={{ showSpinner: false }}
      />
    </NextUIProvider>
  );
}
