import { AppMode } from "../function/helper";

export const useContext = (context: CodeInContext) => {
  const setAppMode = (mode: AppMode) => {
    context.setFieldsValue({ appMode: mode });
  };
  const getAppMode = context.getFieldValue("appMode");
  
  return {
    setAppMode,
    getAppMode,
  };
};
