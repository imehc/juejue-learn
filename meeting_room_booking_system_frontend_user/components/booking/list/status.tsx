import { Chip } from "@nextui-org/chip";
import { FC } from "react";

import { BookingStatusEnum } from "@/meeting-room-booking-api";

interface Props {
  status?: BookingStatusEnum;
}

export const BookingListStatus: FC<Props> = ({ status }) => {
  switch (status) {
    case BookingStatusEnum.Unbind:
      return (
        <Chip color="danger" size="sm" variant="flat">
          已解除
        </Chip>
      );
    case BookingStatusEnum.Pass:
      return (
        <Chip color="success" size="sm" variant="flat">
          通过
        </Chip>
      );
    case BookingStatusEnum.Reject:
      return (
        <Chip color="warning" size="sm" variant="flat">
          驳回
        </Chip>
      );
    case BookingStatusEnum.Apply:
      return (
        <Chip color="primary" size="sm" variant="flat">
          申请中
        </Chip>
      );
    default:
      return <Chip>未知状态</Chip>;
  }
};
