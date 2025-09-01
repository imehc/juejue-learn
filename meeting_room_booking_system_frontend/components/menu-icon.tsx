import { FC } from "react";

import { IconSvgProps } from "~/types";

// https://icon-sets.iconify.design/gravity-ui/?keyword=icon

export const PassIcon: FC<IconSvgProps> = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 16 16"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M13.488 3.43a.75.75 0 0 1 .081 1.058l-6 7a.75.75 0 0 1-1.1.042l-3.5-3.5A.75.75 0 0 1 4.03 6.97l2.928 2.927l5.473-6.385a.75.75 0 0 1 1.057-.081"
        fill={fill}
        fillRule="evenodd"
      />
    </svg>
  );
};

export const RejectIcon: FC<IconSvgProps> = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 16 16"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M2.47 4.72a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06L4.81 6H9a3.25 3.25 0 0 1 0 6.5H8A.75.75 0 0 0 8 14h1a4.75 4.75 0 1 0 0-9.5H4.81l1.72-1.72a.75.75 0 0 0-1.06-1.06z"
        fill={fill}
        fillRule="evenodd"
      />
    </svg>
  );
};

export const UnbindIcon: FC<IconSvgProps> = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 16 16"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8L3.47 4.53a.75.75 0 0 1 0-1.06"
        fill={fill}
        fillRule="evenodd"
      />
    </svg>
  );
};

export const FilterIcon: FC<IconSvgProps> = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 16 16"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M12.5 4c0 .174-.071.513-.885.888S9.538 5.5 8 5.5s-2.799-.237-3.615-.612C3.57 4.513 3.5 4.174 3.5 4s.071-.513.885-.888S6.462 2.5 8 2.5s2.799.237 3.615.612c.814.375.885.714.885.888m-1.448 2.66C10.158 6.888 9.115 7 8 7s-2.158-.113-3.052-.34l1.98 2.905c.21.308.322.672.322 1.044v3.37q.088.02.25.021c.422 0 .749-.14.95-.316c.185-.162.3-.38.3-.684v-2.39c0-.373.112-.737.322-1.045zM8 1c3.314 0 6 1 6 3a3.24 3.24 0 0 1-.563 1.826l-3.125 4.584a.35.35 0 0 0-.062.2V13c0 1.5-1.25 2.5-2.75 2.5s-1.75-1-1.75-1v-3.89a.35.35 0 0 0-.061-.2L2.563 5.826A3.24 3.24 0 0 1 2 4c0-2 2.686-3 6-3m-.88 12.936q-.015-.008-.013-.01z"
        fill={fill}
        fillRule="evenodd"
      />
    </svg>
  );
};

export const BookingIcon: FC<IconSvgProps> = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 16 16"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M3.047 7.125A3 3 0 1 0 4.5 1.5a3 3 0 0 0-1.453 5.625M4.5 6a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m-1.453 8.125A3 3 0 1 0 4.5 8.5a3 3 0 0 0-1.453 5.625M4.5 13a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m7 1.5a3 3 0 1 1 0-6a3 3 0 1 1 0 6m1.5-3a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m-.75-9.25a.75.75 0 0 0-1.5 0v1.501h-1.5a.75.75 0 1 0 0 1.5h1.501v1.502a.75.75 0 0 0 1.5 0V5.25h1.501a.75.75 0 0 0 0-1.5h-1.5z"
        fill={fill}
        fillRule="evenodd"
      />
    </svg>
  );
};

export const UrgeIcon: FC<IconSvgProps> = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 16 16"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M2.5 8a5.5 5.5 0 0 1 8.14-4.827a.75.75 0 1 0 .72-1.315a7 7 0 0 0-9.502 9.502a.75.75 0 0 0 1.315-.72A5.5 5.5 0 0 1 2.5 8m11.642-3.36a.75.75 0 1 0-1.315.72a5.5 5.5 0 0 1-7.466 7.466a.75.75 0 1 0-.722 1.316a7 7 0 0 0 9.502-9.502M9.5 8a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M11 8a3 3 0 1 1-6 0a3 3 0 0 1 6 0"
        fill={fill}
        fillRule="evenodd"
      />
    </svg>
  );
};
