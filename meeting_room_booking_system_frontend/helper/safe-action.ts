import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";

// https://next-safe-action.dev/docs/safe-action-client/initialization-options
// 升级next15、react19后支持有状态操作
// https://github.com/TheEdoRan/next-safe-action/issues?q=is%3Aissue+stateAction+is%3Aclosed
export const actionClient = createSafeActionClient({
  handleServerError: (originalError) => {
    if (originalError instanceof Error) {
      return originalError.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
