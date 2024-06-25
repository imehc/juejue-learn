import { BugIcon, PullRequestIcon } from "../icons";

import { IconWrapper } from "./icon-wrapper";

export const renderSidebarOptionsWithUpdate = (isAdmin?: boolean) => [
  {
    id: 1,
    name: "信息修改",
    href: isAdmin ? "/system/profile-modify" : "/profile-modify",
    icon: (
      <IconWrapper className="bg-success/10 text-success">
        <BugIcon className="text-lg " />
      </IconWrapper>
    ),
    visible: true,
  },
  {
    id: 2,
    name: "密码修改",
    href: isAdmin ? "/system/password-modify" : "/password-modify",
    icon: (
      <IconWrapper className="bg-primary/10 text-primary">
        <PullRequestIcon className="text-lg " />
      </IconWrapper>
    ),
    visible: true,
  },
];
