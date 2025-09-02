"use client";

import {
  Avatar,
  Button,
  Divider,
  getKeyValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { format } from "date-fns";
import { useAction } from "next-safe-action/hooks";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { type FC, useEffect, useTransition } from "react";
import { parseResult } from "~/helper/parse";
import {
  BASE_PATH,
  type User,
  type UserListVo,
} from "~/meeting-room-booking-api";
import { frozenUserAction } from "./actions";
import { userListSchema } from "./schema";

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
      <div className="flex flex-wrap w-full gap-4 md:flex-nowrap">
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
        isHeaderSticky
        isStriped
        aria-label="Example table with client side pagination"
        bottomContent={
          <div className="flex justify-center w-full">
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
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "min-h-[222px] max-h-[580px]",
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
        <TableBody emptyContent="没有符合的数据" items={users}>
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
  const { result, execute } = useAction(frozenUserAction);

  useEffect(() => {
    parseResult(result);
  }, [result]);

  switch (columnKey) {
    case "headPic": {
      const checkHeadPic =
        user.headPic?.startsWith("http://") ||
        user.headPic?.startsWith("https://");
      // 由于未使用OSS对象存储，所以使用OSS对象存储后实际访问地址需要调整
      // 这里使用nginx反向代理，需要添加api后缀
      const bashPath =
        process.env.NODE_ENV === "development"
          ? BASE_PATH
          : "http://localhost/api/".replace(/\/+$/, "");

      const src = user.headPic
        ? checkHeadPic
          ? user.headPic
          : `${bashPath}/${user.headPic}`
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
            onPress={onOpen}
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
                      onPress={() => {
                        onClose();
                        execute({ id: user.id });
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
