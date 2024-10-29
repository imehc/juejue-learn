import {
  parseAbsoluteToLocal,
  toCalendarDateTime,
} from "@internationalized/date";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { SafeParseReturnType } from "zod";

/** 格式化日期 */
export const parseDate = (date?: Date | null) => {
  try {
    if (!date) {
      return null;
    }

    return toCalendarDateTime(parseAbsoluteToLocal(date.toISOString()));
  } catch (error) {
    return null;
  }
};

type ParseResultProps = ReturnType<typeof useAction>["result"];

/**
 * 暂时约定字段，未考虑传递错误的情况
 * 成功传递 `message`
 * 失败直接传递`
 */
export const parseResult = (props: ParseResultProps, func?: () => unknown) => {
  if ((props.data as { message?: string })?.message) {
    toast.success((props.data as { message: string }).message);
    func?.();

    return;
  }
  if (props.serverError) {
    toast.error(props.serverError as string);

    return;
  }
};

/** 格式化错误 */
export const parseZodErr = (parse: SafeParseReturnType<unknown, unknown>) => {
  return parse.error?.errors.map((item) => item.message).join(",");
};
