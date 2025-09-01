import { Pagination } from "@heroui/react";
import { useQueryStates } from "nuqs";
import { FC } from "react";

interface Props {
  skip?: number;
  limit?: number;
  totalCount: number;
  setQueryState?: ReturnType<typeof useQueryStates>[1];
}

export const BookingListBottomContent: FC<Props> = ({
  skip,
  limit,
  totalCount,
  setQueryState,
}) => {
  return (
    <div className="w-full flex justify-center items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="secondary"
        page={(skip ?? 0) + 1}
        total={Math.ceil(totalCount / (limit ?? 10))}
        onChange={(page) => {
          setQueryState?.((state) => {
            return {
              ...state,
              skip: page - 1,
            };
          });
        }}
      />
    </div>
  );
};
