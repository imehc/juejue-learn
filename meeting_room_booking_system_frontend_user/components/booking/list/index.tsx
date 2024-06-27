"use client";

import { Chip } from "@nextui-org/chip";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { useDisclosure } from "@nextui-org/modal";
import { Tooltip } from "@nextui-org/tooltip";
import { format } from "date-fns";
import { FC, useMemo, useRef, useState } from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";

import { BookingListTopContent, BookingListTopContentRef } from "./top-content";
import { BookingListBottomContent } from "./bottom-content";
import { BookingListStatus } from "./status";

import {
  Booking,
  BookingList as BookingListImpl,
  BookingStatusEnum,
} from "@/meeting-room-booking-api";
import { ConfimModal } from "@/components/confirm-modal";
import {
  FilterIcon,
  PassIcon,
  RejectIcon,
  UnbindIcon,
} from "@/components/menu-icon";

type SystemAction = {
  type: "system";
  passBooking: ({ id }: Pick<Booking, "id">) => Promise<{
    data: string;
  }>;
  rejectBooking: ({ id }: Pick<Booking, "id">) => Promise<{
    data: string;
  }>;
  unbindBooking: ({ id }: Pick<Booking, "id">) => Promise<{
    data: string;
  }>;
};

type NormalAction = {
  type: "normal";
};

interface Props extends BookingListImpl {
  status?: BookingStatusEnum;
}

type IProps = (Props & SystemAction) | (Props & NormalAction);

export function BookingList({
  bookings,
  totalCount,
  status,
  ...props
}: IProps) {
  const topContentRef = useRef<BookingListTopContentRef>(null);

  return (
    <Table
      isHeaderSticky
      isStriped
      aria-label="Example table with client side pagination"
      bottomContent={
        <BookingListBottomContent
          limit={topContentRef.current?.limit}
          setQueryState={topContentRef.current?.setQueryState}
          skip={topContentRef.current?.skip}
          totalCount={totalCount}
        />
      }
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "min-h-[222px] max-h-[580px]",
      }}
      topContent={<BookingListTopContent ref={topContentRef} />}
      topContentPlacement="outside"
    >
      <TableHeader>
        <TableColumn key="name">会议室名称</TableColumn>
        <TableColumn key="location">会议室位置</TableColumn>
        <TableColumn key="username">预定人</TableColumn>
        <TableColumn key="startAt">开始时间</TableColumn>
        <TableColumn key="endAt">结束时间</TableColumn>
        <TableColumn key="status">
          <Chip
            endContent={
              <Popover showArrow offset={10} placement="bottom">
                <PopoverTrigger>
                  <Button isIconOnly color="default" size="sm" variant="light">
                    <FilterIcon size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px]">
                  {() => (
                    <div className="px-1 py-2 w-full">
                      <CheckboxGroup
                        value={[status || []].flat()}
                        onChange={(keys) => {
                          topContentRef.current?.setQueryState?.((state) => {
                            return {
                              ...state,
                              // TODO: 暂时同时只支持选择一个状态
                              status: keys.length ? keys.at(-1) : null,
                              skip: 0,
                            };
                          });
                        }}
                      >
                        {Object.values(BookingStatusEnum).map((item) => (
                          <Checkbox key={item} value={item}>
                            <BookingListStatus status={item} />
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            }
            size="sm"
            style={{
              // 与其他表头一致
              color:
                "hsl(var(--nextui-foreground-500) / var(--nextui-foreground-500-opacity, var(--tw-text-opacity)))",
            }}
            variant="light"
          >
            <span className="font-semibold">审批状态</span>
          </Chip>
        </TableColumn>
        <TableColumn key="createAt">预定时间</TableColumn>
        <TableColumn key="remark">备注</TableColumn>
        <TableColumn key="actions">操作</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."} items={bookings}>
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
  );
}

const TableItem: FC<
  { columnKey: string; item: Booking } & (SystemAction | NormalAction)
> = ({ columnKey, item, ...props }) => {
  const { onOpen, onClose, ...attr } = useDisclosure();
  const [status, setStatus] = useState<BookingStatusEnum>();

  const statusTxt = useMemo(() => {
    switch (status) {
      case BookingStatusEnum.Pass:
        return "通过";
      case BookingStatusEnum.Reject:
        return "驳回";
      case BookingStatusEnum.Unbind:
        return "解除";
      default:
        return;
    }
  }, [status]);

  switch (columnKey) {
    case "name":
      return item.room?.name ?? "-";
    case "location":
      return item.room?.location ?? "-";
    case "username":
      return item.user?.username ?? "-";
    case "startAt":
      return format(item.startAt, "yyyy-MM-dd HH:mm:ss");
    case "endAt":
      return format(item.endAt, "yyyy-MM-dd HH:mm:ss");
    case "createAt":
      return format(item.createAt, "yyyy-MM-dd HH:mm:ss");
    case "status":
      return <BookingListStatus status={item.status} />;
    case "actions":
      return props.type === "system" ? (
        <>
          <ButtonGroup isDisabled={item.status !== BookingStatusEnum.Apply}>
            <Tooltip showArrow color="success" content="通过申请">
              <Button
                isIconOnly
                color="success"
                size="sm"
                variant="bordered"
                onClick={() => {
                  setStatus(BookingStatusEnum.Pass);
                  onOpen();
                }}
              >
                <PassIcon />
              </Button>
            </Tooltip>
            <Tooltip showArrow color="danger" content="驳回申请">
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="bordered"
                onClick={() => {
                  setStatus(BookingStatusEnum.Reject);
                  onOpen();
                }}
              >
                <RejectIcon />
              </Button>
            </Tooltip>
            <Tooltip showArrow color="warning" content="解除申请">
              <Button
                isIconOnly
                color="warning"
                size="sm"
                variant="bordered"
                onClick={() => {
                  setStatus(BookingStatusEnum.Unbind);
                  onOpen();
                }}
              >
                <UnbindIcon />
              </Button>
            </Tooltip>
          </ButtonGroup>
          <ConfimModal
            header={`${statusTxt}申请`}
            onCancel={() => {
              onClose();
              setStatus(undefined);
            }}
            onClose={onClose}
            onConfirm={async () => {
              try {
                switch (status) {
                  case BookingStatusEnum.Pass:
                    {
                      const { data } = await props.passBooking({ id: item.id });

                      toast.success(data ?? "通过成功");
                    }

                    return;
                  case BookingStatusEnum.Reject:
                    {
                      const { data } = await props.rejectBooking({
                        id: item.id,
                      });

                      toast.success(data ?? "驳回成功");
                    }

                    return;
                  case BookingStatusEnum.Unbind:
                    {
                      const { data } = await props.unbindBooking({
                        id: item.id,
                      });

                      toast.success(data ?? "解除成功");
                    }

                    return;
                }
              } catch (error) {
                toast.warning(`${statusTxt}失败`);
              } finally {
                onClose();
                setStatus(undefined);
              }
            }}
            onOpen={onOpen}
            {...attr}
          >
            <p>
              确定要
              {statusTxt}：{item.user.username} 的预定申请吗？
            </p>
          </ConfimModal>
        </>
      ) : (
        <></>
      );
    default:
      return getKeyValue(item, columnKey);
  }
};
