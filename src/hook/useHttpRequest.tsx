import axios from "axios";

const ENV: "UAT" | "PROD" = "UAT";

const CONFIG = {
  UAT: {
    GET_INFO:
      "https://defaultb3e19ac2e19244c890bd41acbfb3dc.db.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/06bf64f305b04702b5925a49c40203ce/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7ShCsmdvwCoGc6KFUlnv78iI7j7Rxtx7CYKNOnNyPpk",
    CREATE_STOCK_TAKE:
      "https://defaultb3e19ac2e19244c890bd41acbfb3dc.db.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/6b73ec63ebe24f11b55a9e68fb1badc7/triggers/manual/paths/invoke?api-version=1",
  },
  PROD: {
    GET_INFO:
      "https://defaultb3e19ac2e19244c890bd41acbfb3dc.db.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/06bf64f305b04702b5925a49c40203ce/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7ShCsmdvwCoGc6KFUlnv78iI7j7Rxtx7CYKNOnNyPpk",
    CREATE_STOCK_TAKE:
      "https://defaultb3e19ac2e19244c890bd41acbfb3dc.db.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/6b73ec63ebe24f11b55a9e68fb1badc7/triggers/manual/paths/invoke?api-version=1",
  },
};

export const useHttpRequest = (context: CodeInContext) => {
  const URL = CONFIG[ENV];
  const getInitInfo = async () => {
    const response = await axios.post(URL.GET_INFO, {
      email: "chrissie.kwan@hkstp.org",
      // email: getCurrentUser(context).email,
    });
    return response.data;
  };

  const createStockTakeSheet = async (data) => {
    const response = await axios.post(URL.CREATE_STOCK_TAKE, {
      email: "chrissie.kwan@hkstp.org",
      data,
    });
    return response.data;
  };

  return { getInitInfo, createStockTakeSheet };
};
