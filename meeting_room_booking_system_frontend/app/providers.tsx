"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "sonner";

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
      <ThemeProvider {...themeProps}>{children}</ThemeProvider>
      <Toaster richColors position="top-center" />
    </NextUIProvider>
  );
}
