import { BugIcon, PullRequestIcon } from "../icons";

import { IconWrapper } from "./icon-wrapper";

export const sidebarOptionsWithNormal = [
  {
    id: 1,
    name: "会议室列表",
    href: "/meeting-room",
    icon: (
      <IconWrapper className="bg-success/10 text-success">
        <BugIcon className="text-lg " />
      </IconWrapper>
    ),
    visible: true,
  },
  {
    id: 2,
    name: "预定历史",
    href: "/booking-history",
    icon: (
      <IconWrapper className="bg-primary/10 text-primary">
        <PullRequestIcon className="text-lg " />
      </IconWrapper>
    ),
    visible: true,
  },
];
