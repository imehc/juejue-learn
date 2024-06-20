import {
  BookIcon,
  BugIcon,
  ChatIcon,
  LayoutIcon,
  PlayCircleIcon,
  PullRequestIcon,
  TagIcon,
  UsersIcon,
  WatchersIcon,
} from "../icons";

import { IconWrapper } from "./icon-wrapper";

export const sidebarOptions = [
  {
    id: 1,
    name: "会议室管理",
    href: "/system/conference",
    icon: (
      <IconWrapper className="bg-success/10 text-success">
        <BugIcon className="text-lg " />
      </IconWrapper>
    ),
    visible: true,
  },
  {
    id: 2,
    name: "预定管理",
    href: "/system/reserve",
    icon: (
      <IconWrapper className="bg-primary/10 text-primary">
        <PullRequestIcon className="text-lg " />
      </IconWrapper>
    ),
    visible: true,
  },
  {
    id: 3,
    name: "用户管理",
    href: "/system/user",
    icon: (
      <IconWrapper className="bg-secondary/10 text-secondary">
        <ChatIcon className="text-lg " />
      </IconWrapper>
    ),
    visible: true,
  },
  {
    id: 4,
    name: "统计",
    href: "/system/statistics",
    icon: (
      <IconWrapper className="bg-warning/10 text-warning">
        <PlayCircleIcon className="text-lg " />
      </IconWrapper>
    ),
    visible: true,
  },
  {
    id: 5,
    name: "统计2",
    href: "#",
    icon: (
      <IconWrapper className="bg-default/50 text-foreground">
        <LayoutIcon className="text-lg " />
      </IconWrapper>
    ),
    visible: false,
  },
  {
    id: 6,
    name: "统计3",
    href: "#",
    icon: (
      <IconWrapper className="bg-primary/10 text-primary">
        <TagIcon className="text-lg" />
      </IconWrapper>
    ),
    visible: false,
  },
  {
    id: 7,
    name: "统计4",
    href: "#",
    icon: (
      <IconWrapper className="bg-warning/10 text-warning">
        <UsersIcon />
      </IconWrapper>
    ),
    visible: false,
  },
  {
    id: 8,
    name: "统计5",
    href: "#",
    icon: (
      <IconWrapper className="bg-default/50 text-foreground">
        <WatchersIcon />
      </IconWrapper>
    ),
    visible: false,
  },
  {
    id: 9,
    name: "统计5",
    href: "#",
    icon: (
      <IconWrapper className="bg-danger/10 text-danger dark:text-danger-500">
        <BookIcon />
      </IconWrapper>
    ),
    visible: false,
  },
];
