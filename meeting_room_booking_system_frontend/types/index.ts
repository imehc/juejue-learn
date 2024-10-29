import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type BasicPageParams<T1 = unknown, T2 = unknown> = {
  params?: Promise<T1>;
  searchParams?: Promise<T2>;
};
