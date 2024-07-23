"use client";

import type {
  PassBookingAction,
  RejectBookingAction,
  UnbindBookingAction,
} from "@/app/(auth)/system/(manage)/booking/actions";

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
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";

import { BookingListTopContent, BookingListTopContentRef } from "./top-content";
import { BookingListBottomContent } from "./bottom-content";
import { BookingListStatus } from "./status";
import { urgeBookingAction } from "./actions";

import {
  Booking,
  BookingList as BookingListImpl,
  BookingStatusEnum,
} from "@/meeting-room-booking-api";
import {
  FilterIcon,
  PassIcon,
  RejectIcon,
  UnbindIcon,
  UrgeIcon,
} from "@/components/menu-icon";
import { ConfimModal } from "@/components/confirm-modal";
import { parseResult } from "@/helper/parse-result";

type SystemAction = {
  type: "system";
  passBooking: PassBookingAction;
  rejectBooking: RejectBookingAction;
  unbindBooking: UnbindBookingAction;
};

type NormalAction = {
  type: "normal";
  unbindBooking: UnbindBookingAction;
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
      topContent={
        <BookingListTopContent ref={topContentRef} type={props.type} />
      }
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
                    <div className="w-full px-1 py-2">
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
        <SystemAction
          attr={attr}
          item={item}
          passBooking={props.passBooking}
          rejectBooking={props.rejectBooking}
          setStatus={setStatus}
          status={status}
          unbindBooking={props.unbindBooking}
          onClose={onClose}
          onOpen={onOpen}
        />
      ) : (
        <NormalAction
          attr={attr}
          item={item}
          setStatus={setStatus}
          status={status}
          unbindBooking={props.unbindBooking}
          onClose={onClose}
          onOpen={onOpen}
        />
      );
    default:
      return getKeyValue(item, columnKey);
  }
};

type NormalActionProps = {
  item: Booking;
  onOpen(): void;
  onClose(): void;
  status?: BookingStatusEnum;
  setStatus(status?: BookingStatusEnum): void;
  attr: Omit<ReturnType<typeof useDisclosure>, "onOpen" | "onClose">;
} & Omit<NormalAction, "type">;

const NormalAction: React.FC<NormalActionProps> = ({
  item,
  status,
  onOpen,
  onClose,
  setStatus,
  attr,
  unbindBooking,
}) => {
  const { execute, result } = useAction(unbindBooking);
  const { execute: urgeExecute, result: urgeResult } =
    useAction(urgeBookingAction);

  useEffect(() => {
    parseResult(urgeResult);
  }, [urgeResult]);
  useEffect(() => {
    parseResult(result);
  }, [result]);

  return (
    <>
      <ButtonGroup isDisabled={item.status !== BookingStatusEnum.Apply}>
        <Tooltip showArrow color="warning" content="解除预定">
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
        <Tooltip showArrow color="danger" content="催办">
          <Button
            isIconOnly
            color="danger"
            size="sm"
            variant="bordered"
            onClick={() => {
              urgeExecute({ bookingId: item.id });
            }}
          >
            <UrgeIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>
      <ConfimModal
        header="解除预定"
        onCancel={() => {
          onClose();
          setStatus(undefined);
        }}
        onClose={onClose}
        onConfirm={async () => {
          try {
            switch (status) {
              case BookingStatusEnum.Unbind:
                {
                  execute({ id: item.id });
                }

                return;
            }
          } catch (error) {
            toast.error("解除预定失败");
          } finally {
            onClose();
            setStatus(undefined);
          }
        }}
        onOpen={onOpen}
        {...attr}
      >
        <p>
          确定要解除
          <span className="text-primary-500">{item.room?.name ?? "-"}</span>
          会议室预定吗？
        </p>
      </ConfimModal>
    </>
  );
};

type SystemActionProps = Omit<SystemAction, "type"> &
  Omit<NormalActionProps, "unbindBooking">;

const SystemAction: FC<SystemActionProps> = ({
  item,
  status,
  setStatus,
  onClose,
  onOpen,
  attr,
  passBooking,
  rejectBooking,
  unbindBooking,
}) => {
  const { result: passResult, execute: passExecute } = useAction(passBooking);
  const { result: rejectResult, execute: rejectExecute } =
    useAction(rejectBooking);
  const { result: unbindResult, execute: unbindExecute } =
    useAction(unbindBooking);

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

  useEffect(() => {
    parseResult(passResult);
  }, [passResult]);
  useEffect(() => {
    parseResult(rejectResult);
  }, [rejectResult]);
  useEffect(() => {
    parseResult(unbindResult);
  }, [unbindResult]);

  return (
    <>
      <ButtonGroup>
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
                  passExecute({ id: item.id });
                }

                return;
              case BookingStatusEnum.Reject:
                {
                  rejectExecute({ id: item.id });
                }

                return;
              case BookingStatusEnum.Unbind:
                {
                  unbindExecute({ id: item.id });
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
          {statusTxt}：
          <span className="text-primary-500">{item.room?.name ?? "-"}</span>{" "}
          的预定申请吗？
        </p>
      </ConfimModal>
    </>
  );
};
