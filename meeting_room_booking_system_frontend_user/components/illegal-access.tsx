"use cleint";

import { FC, useEffect } from "react";
import { toast } from "sonner";

export const IllegalAccess: FC = () => {
  useEffect(() => {
    toast.error("非法访问");
  }, []);

  return null;
};
