"use client";

import { Input } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { format } from "date-fns";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { FC, useTransition } from "react";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import { Avatar } from "@nextui-org/avatar";

import { userListSchema } from "./schema";
import { frozenUser } from "./actions";

import { BASE_PATH, User, UserListVo } from "@/meeting-room-booking-api";

interface Props extends UserListVo {}

export function UserList({ users, totalCount }: Props) {
  const [, startTransition] = useTransition();
  const [{ limit, skip, username, nickName, email }, setQueryState] =
    useQueryStates(
      {
        limit: parseAsInteger.withDefault(10),
        skip: parseAsInteger.withDefault(0),
        username: parseAsString,
        nickName: parseAsString,
        email: parseAsString,
      },
      {
        shallow: false,
        startTransition,
      },
    );

  return (
    <div className="h-full">
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input
          defaultValue={username ?? undefined}
          label="用户名"
          type="text"
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                username: userListSchema.shape.username.parse(evt.target.value),
                skip: 0,
              };
            });
          }}
        />
        <Input
          defaultValue={nickName ?? undefined}
          label="昵称"
          type="text"
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                nickName: userListSchema.shape.nickName.parse(evt.target.value),
                skip: 0,
              };
            });
          }}
        />
        <Input
          defaultValue={email ?? undefined}
          label="邮箱"
          type="text"
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                email: userListSchema.shape.email.parse(evt.target.value),
                skip: 0,
              };
            });
          }}
        />
      </div>
      <Divider className="my-4" />
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={skip + 1}
              total={Math.ceil(totalCount / limit)}
              onChange={(page) => {
                setQueryState((state) => {
                  return {
                    ...state,
                    skip: page - 1,
                  };
                });
              }}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="username">用户名</TableColumn>
          <TableColumn key="headPic">头像</TableColumn>
          <TableColumn key="nickName">昵称</TableColumn>
          <TableColumn key="email">邮箱</TableColumn>
          <TableColumn key="createAt">注册时间</TableColumn>
          <TableColumn key="isFrozen">状态</TableColumn>
          <TableColumn key="actions">操作</TableColumn>
        </TableHeader>
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  <TableItem columnKey={columnKey as string} user={item} />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const TableItem: FC<{ columnKey: string; user: User }> = ({
  columnKey,
  user,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  switch (columnKey) {
    case "headPic": {
      const checkHeadPic =
        user.headPic?.startsWith("http://") ||
        user.headPic?.startsWith("https://");
      const src = user.headPic
        ? checkHeadPic
          ? user.headPic
          : `${BASE_PATH}/${user.headPic}`
        : undefined;

      return (
        <Avatar
          className="w-6 h-6 text-tiny"
          name={user.nickName?.slice(0, 1)}
          src={src}
        />
      );
    }
    case "createAt":
      return format(user.createAt, "yyyy-MM-dd HH:mm:ss");
    case "isFrozen":
      return user.isFrozen ? "已冻结" : "-";
    case "actions":
      return (
        <>
          <Button
            color="danger"
            isDisabled={user.isFrozen}
            variant="light"
            onClick={onOpen}
          >
            冻结
          </Button>
          <Modal
            backdrop="opaque"
            classNames={{
              backdrop:
                "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
            }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    提示
                  </ModalHeader>
                  <ModalBody>
                    <p>确定要冻结：{user.username} 用户吗？</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      取消
                    </Button>
                    <Button
                      color="primary"
                      onPress={async () => {
                        onClose();
                        const { data } = await frozenUser({ id: user.id });

                        if (data !== "fail") {
                          toast.success(data || "冻结成功");

                          return;
                        }
                        toast.success(data || "冻结失败");
                      }}
                    >
                      确定
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      );
    default:
      return getKeyValue(user, columnKey);
  }
};
