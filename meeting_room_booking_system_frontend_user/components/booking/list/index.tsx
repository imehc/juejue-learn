"use client";

import { Input } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import { DatePicker, useDatePicker } from "@nextui-org/date-picker";
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
import { useDisclosure } from "@nextui-org/modal";
import { format } from "date-fns";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { FC, useCallback, useMemo, useState, useTransition } from "react";
import { Button } from "@nextui-org/button";
import { CalendarDateTime } from "@internationalized/date";
import { DateValue } from "@internationalized/date";
import { toast } from "sonner";

import { bookingListSchema } from "./schema";

import {
  Booking,
  BookingList as BookingListImpl,
  BookingStatusEnum,
} from "@/meeting-room-booking-api";
import { ConfimModal } from "@/components/confirm-modal";

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

interface Props extends BookingListImpl {}

type IProps = (Props & SystemAction) | (Props & NormalAction);

export function BookingList({ bookings, totalCount, ...props }: IProps) {
  const [, startTransition] = useTransition();
  const [
    { limit, skip, username, name, location, startAt, endAt },
    setQueryState,
  ] = useQueryStates(
    {
      limit: parseAsInteger.withDefault(10),
      skip: parseAsInteger.withDefault(0),
      username: parseAsString,
      name: parseAsString,
      location: parseAsString,
      startAt: parseAsIsoDateTime,
      endAt: parseAsIsoDateTime,
    },
    {
      shallow: false,
      startTransition,
    },
  );

  const {} = useDatePicker({});

  const parseDate = useCallback(
    (date?: Date | null) => {
      try {
        if (!date) {
          return null;
        }

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();

        return new CalendarDateTime(year, month, day, hour, minute);
      } catch (error) {
        return null;
      }
    },
    [startAt, endAt],
  );

  return (
    <div className="h-full">
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input
          label="预定人"
          type="text"
          value={username ?? ""}
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                username: bookingListSchema.shape.username.parse(
                  evt.target.value,
                ),
                skip: 0,
              };
            });
          }}
        />
        <Input
          label="会议室名称"
          type="text"
          value={name ?? ""}
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                name: bookingListSchema.shape.name.parse(evt.target.value),
                skip: 0,
              };
            });
          }}
        />
        <Input
          label="地址"
          type="text"
          value={location ?? ""}
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                location: bookingListSchema.shape.location.parse(
                  evt.target.value,
                ),
                skip: 0,
              };
            });
          }}
        />
        <DatePicker
          showMonthAndYearPickers
          className="max-w-[284px]"
          granularity="minute"
          label="开始时间"
          maxValue={parseDate(endAt) as DateValue}
          value={parseDate(startAt)}
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                startAt: bookingListSchema.shape.startAt.parse(
                  new Date(evt.toString()),
                ),
                skip: 0,
              };
            });
          }}
        />
        <DatePicker
          showMonthAndYearPickers
          className="max-w-[284px]"
          granularity="minute"
          label="结束时间"
          minValue={parseDate(startAt) as DateValue}
          value={parseDate(endAt)}
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                endAt: bookingListSchema.shape.endAt.parse(
                  new Date(evt.toString()),
                ),
                skip: 0,
              };
            });
          }}
        />
        <Button
          className="h-14"
          color="secondary"
          onClick={() => {
            setQueryState((state) => {
              return {
                ...state,
                username: null,
                name: null,
                location: null,
                startAt: null,
                endAt: null,
                skip: 0,
              };
            });
          }}
        >
          重置
        </Button>
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
          <TableColumn key="name">会议室名称</TableColumn>
          <TableColumn key="location">会议室位置</TableColumn>
          <TableColumn key="username">预定人</TableColumn>
          <TableColumn key="startAt">开始时间</TableColumn>
          <TableColumn key="endAt">结束时间</TableColumn>
          <TableColumn key="status">审批状态</TableColumn>
          <TableColumn key="createAt">预定时间</TableColumn>
          <TableColumn key="remark">备注</TableColumn>
          <TableColumn key="actions">操作</TableColumn>
        </TableHeader>
        <TableBody items={bookings}>
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
      switch (item.status) {
        case BookingStatusEnum.Unbind:
          return <span className="text-danger">已解除</span>;
        case BookingStatusEnum.Pass:
          return <span className="text-success">申请通过</span>;
        case BookingStatusEnum.Reject:
          return <span className="text-warning">申请失败</span>;
        default:
          return <span className="text-blue-500">申请中</span>;
      }
    case "actions":
      return props.type === "system" ? (
        <>
          <Button
            color="success"
            isDisabled={item.status !== BookingStatusEnum.Apply}
            variant="light"
            onClick={() => {
              setStatus(BookingStatusEnum.Pass);
              onOpen();
            }}
          >
            通过
          </Button>
          <Button
            color="danger"
            isDisabled={item.status !== BookingStatusEnum.Apply}
            variant="light"
            onClick={() => {
              setStatus(BookingStatusEnum.Reject);
              onOpen();
            }}
          >
            驳回
          </Button>
          <Button
            color="warning"
            isDisabled={item.status !== BookingStatusEnum.Apply}
            variant="light"
            onClick={() => {
              setStatus(BookingStatusEnum.Unbind);
              onOpen();
            }}
          >
            解除
          </Button>
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
