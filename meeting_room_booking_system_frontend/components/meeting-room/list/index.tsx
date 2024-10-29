"use client";

import type { DelMeetingRoomAction } from "@/app/(auth)/system/(manage)/meeting-room/actions";

import { format } from "date-fns";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { type FC, useEffect, useTransition } from "react";
import { useAction } from "next-safe-action/hooks";
import {
  Button,
  ButtonGroup,
  Divider,
  getKeyValue,
  Input,
  Link,
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
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";

import { meetingRoomListSchema } from "./schema";

import {
  MeetingRoom,
  MeetingRoomList as MeetingRoomListImpl,
} from "@/meeting-room-booking-api";
import { BookingIcon } from "@/components/menu-icon";
import { parseResult } from "@/helper/parse";

type SystemAction = {
  type: "system";
  delMeetingRoom: DelMeetingRoomAction;
};

type NormalAction = {
  type: "normal";
  isFrozen: boolean;
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
      <div className="flex flex-wrap w-full gap-4 md:flex-nowrap">
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
            className="px-12 h-14"
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
        <TableBody emptyContent="没有符合的数据" items={meetingRooms}>
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
      return item.isBooked ? (
        "已预定"
      ) : (
        <span>{props.type === "system" ? "未预定" : "可预定"}</span>
      );
    case "actions":
      return props.type === "system" ? (
        <SystemMeetingRoomOption
          delMeetingRoom={props.delMeetingRoom}
          isOpen={isOpen}
          item={item}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
        />
      ) : (
        <Tooltip showArrow color="success" content="预定">
          <Button
            isIconOnly
            as={Link}
            color="success"
            href={`/meeting-room/booking/${item.id}`}
            isDisabled={props.isFrozen}
            size="sm"
            variant="bordered"
          >
            <BookingIcon />
          </Button>
        </Tooltip>
      );
    default:
      return getKeyValue(item, columnKey);
  }
};

interface SystemMeetingRoomOptionProps extends Omit<SystemAction, "type"> {
  item: MeetingRoom;
  isOpen: boolean;
  onOpen(): void;
  onOpenChange(): void;
}

const SystemMeetingRoomOption: React.FC<SystemMeetingRoomOptionProps> = ({
  isOpen,
  onOpen,
  onOpenChange,
  item,
  delMeetingRoom,
}) => {
  const { execute, result } = useAction(delMeetingRoom);

  useEffect(() => parseResult(result), [result]);

  return (
    <>
      <ButtonGroup>
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
      </ButtonGroup>
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
              <ModalHeader className="flex flex-col gap-1">提示</ModalHeader>
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
                    execute({ id: item.id });
                    onClose();
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
};
