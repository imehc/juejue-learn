import clsx from "clsx";
import type { HTMLAttributes } from "react";

export const IconWrapper = ({
  children,
  className,
}: Pick<HTMLAttributes<HTMLDivElement>, "className" | "children">) => (
  <div
    className={clsx(
      className,
      "flex items-center rounded-small justify-center w-7 h-7",
    )}
  >
    {children}
  </div>
);
