import { AppMode } from "../function/helper";

export const useContext = (context: CodeInContext) => {
  const setAppMode = (mode: AppMode) => {
    context.setFieldsValue({ appMode: mode });
  };
  const getAppMode = context.getFieldValue("appMode");

  const setLastSyncTime = (lastSync: string) => {
    context.setFieldsValue({ lastSync });
  };
  const getLastSyncTime = context.getFieldValue("lastSync");

  return {
    setAppMode,
    getAppMode,
    setLastSyncTime,
    getLastSyncTime,
  };
};
