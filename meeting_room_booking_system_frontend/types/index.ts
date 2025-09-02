import type { SVGProps } from "react";
import "@heroui/react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type BasicPageParams<T1 = unknown, T2 = unknown> = {
  params?: Promise<T1>;
  searchParams?: Promise<T2>;
};

declare module "@heroui/react" {
  interface ButtonProps {
    formAction?: string | ((formData: FormData) => void | Promise<void>);
  }
}
