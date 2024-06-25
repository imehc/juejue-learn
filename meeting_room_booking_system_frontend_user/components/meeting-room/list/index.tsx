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
import { Link } from "@nextui-org/link";

import { meetingRoomListSchema } from "./schema";

import {
  MeetingRoom,
  MeetingRoomList as MeetingRoomListImpl,
} from "@/meeting-room-booking-api";

type SystemAction = {
  type: "system";
  delMeetingRoom: ({ id }: Pick<MeetingRoom, "id">) => Promise<{
    data: string;
  }>;
};

type NormalAction = {
  type: "normal";
  subscribeMeetingRoom: ({ id }: Pick<MeetingRoom, "id">) => Promise<{
    data: string;
  }>;
};

interface Props extends MeetingRoomListImpl {}

type IProps = (Props & SystemAction) | (Props & NormalAction);

export function MeetingRoomList({
  meetingRooms,
  totalCount,
  ...props
}: IProps) {
  const [, startTransition] = useTransition();
  const [{ limit, skip, name, capacity, equipment }, setQueryState] =
    useQueryStates(
      {
        limit: parseAsInteger.withDefault(10),
        skip: parseAsInteger.withDefault(0),
        name: parseAsString,
        capacity: parseAsInteger,
        equipment: parseAsString,
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
          defaultValue={name ?? undefined}
          label="会议室名称"
          type="text"
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                name: meetingRoomListSchema.shape.name.parse(evt.target.value),
                skip: 0,
              };
            });
          }}
        />
        <Input
          defaultValue={capacity?.toString() ?? undefined}
          label="容纳人数"
          type="text"
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                capacity: meetingRoomListSchema.shape.capacity.parse(
                  evt.target.value,
                ),
                skip: 0,
              };
            });
          }}
        />
        <Input
          defaultValue={equipment ?? undefined}
          label="设备"
          type="text"
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                equipment: meetingRoomListSchema.shape.equipment.parse(
                  evt.target.value,
                ),
                skip: 0,
              };
            });
          }}
        />
        {props.type === "system" && (
          <Button
            as={Link}
            className="h-14 px-12"
            color="primary"
            href={`/system/meeting-room/new`}
            variant="solid"
          >
            创建会议室
          </Button>
        )}
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
          <TableColumn key="name">名称</TableColumn>
          <TableColumn key="capacity">容纳人数</TableColumn>
          <TableColumn key="location">位置</TableColumn>
          <TableColumn key="equipment">设备</TableColumn>
          <TableColumn key="description">描述</TableColumn>
          <TableColumn key="createAt">添加时间</TableColumn>
          <TableColumn key="updateAt">上次更新时间</TableColumn>
          <TableColumn key="isBooked">预定状态</TableColumn>
          <TableColumn key="actions">操作</TableColumn>
        </TableHeader>
        <TableBody items={meetingRooms}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  <TableItem
                    columnKey={columnKey as string}
                    item={item}
                    {...props}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const TableItem: FC<
  { columnKey: string; item: MeetingRoom } & (SystemAction | NormalAction)
> = ({ columnKey, item, ...props }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  switch (columnKey) {
    case "createAt":
    case "updateAt":
      return format(item.createAt, "yyyy-MM-dd HH:mm:ss");
    case "isBooked":
      return item.isBooked ? "已预定" : "未预定";
    case "actions":
      return props.type === "system" ? (
        <>
          <Button color="danger" variant="light" onClick={onOpen}>
            删除
          </Button>
          <Button
            as={Link}
            color="primary"
            href={`/system/meeting-room/${item.id}`}
            variant="light"
          >
            更新
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
                    <p>确定要删除：{item.name} 会议室吗？</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      取消
                    </Button>
                    <Button
                      color="primary"
                      onPress={async () => {
                        onClose();
                        const { data } = await props.delMeetingRoom({
                          id: item.id,
                        });

                        if (data !== "fail") {
                          toast.success(data || "删除成功");

                          return;
                        }
                        toast.success(data || "删除失败");
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
      ) : (
        <>
          <Button color="danger" variant="light" onClick={onOpen}>
            预约
          </Button>{" "}
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
                    <p>确定要预约：{item.name} 会议室吗？</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      取消
                    </Button>
                    <Button
                      color="primary"
                      onPress={async () => {
                        onClose();
                        const { data } = await props.subscribeMeetingRoom({
                          id: item.id,
                        });

                        if (data !== "fail") {
                          toast.success(data || "预约成功");

                          return;
                        }
                        toast.success(data || "预约失败");
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
      return getKeyValue(item, columnKey);
  }
};
