"use client";

import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { useRouter } from "next/navigation";

import { sidebarOptionsWithNormal } from "./normal-options";
import { sidebarOptionsWithSystem } from "./system-options";
import { renderSidebarOptionsWithUpdate } from "./update-options";

interface Props {
  type: "system" | "update" | "normal";
  isAdmin?: boolean;
}

export function SlideBar({ type, isAdmin = false }: Props) {
  const router = useRouter();

  return (
    <Listbox
      aria-label="User Menu"
      className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible shadow-small rounded-medium"
      itemClasses={{
        base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
      }}
      onAction={(key) => router.push(key as string)}
    >
      {(type === "normal"
        ? sidebarOptionsWithNormal
        : type === "system"
          ? sidebarOptionsWithSystem
          : renderSidebarOptionsWithUpdate(isAdmin)
      )
        .filter((item) => item.visible)
        .map((item) => (
          <ListboxItem
            key={item.href}
            // endContent={<ItemCounter number={13} />}
            startContent={item.icon}
          >
            {item.id === 6 ? (
              <div className="flex flex-col gap-1">
                <span>{item.name}</span>
                <div className="px-2 py-1 rounded-small bg-default-100 group-data-[hover=true]:bg-default-200">
                  <span className="text-tiny text-default-600">
                    @nextui-org/react@2.0.10
                  </span>
                  <div className="flex gap-2 text-tiny">
                    <span className="text-default-500">49 minutes ago</span>
                    <span className="text-success">Latest</span>
                  </div>
                </div>
              </div>
            ) : (
              item.name
            )}
          </ListboxItem>
        ))}
    </Listbox>
  );
}
