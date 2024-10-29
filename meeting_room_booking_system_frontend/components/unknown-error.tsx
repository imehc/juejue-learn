interface Props {
  msg?: string;
}

export function UnknownError({ msg }: Props) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <span className="text-red-300">Error：</span>
      <span className="text-red-400">{msg || "未知错误"}</span>
    </div>
  );
}
