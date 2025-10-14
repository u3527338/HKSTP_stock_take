import { AppMode, getFromStorage, setToStorage } from "../function/helper";

export const useContext = (context: CodeInContext) => {
  const setAppMode = (mode: AppMode) => {
    context.setFieldsValue({ appMode: mode });
  };
  const getAppMode = context.getFieldValue("appMode");

  const setConfig = (value) => {
    const config = getFromStorage("config", "object");
    const updateConfig = { ...config, ...value };
    setToStorage("config", updateConfig);
    context.setFieldsValue({ config: updateConfig });
  };

  const getConfig = () => {
    const contextValue = context.getFieldValue("config");
    return JSON.parse(localStorage.getItem("config")) || contextValue;
  };

  return {
    setAppMode,
    getAppMode,
    setConfig,
    getConfig,
  };
};
