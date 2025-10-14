import axios from "axios";

export const useHttpRequest = (context: CodeInContext) => {
  const AZURE_URL =
    "https://defaultb3e19ac2e19244c890bd41acbfb3dc.db.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/06bf64f305b04702b5925a49c40203ce/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7ShCsmdvwCoGc6KFUlnv78iI7j7Rxtx7CYKNOnNyPpk";

  const getInitInfo = async () => {
    const response = await axios.post(AZURE_URL, {
      email: "chrissie.kwan@hkstp.org",
      // email: getCurrentUser(context).email,
    });
    return response.data;
  };

  const createStockTakeSheet = async (body) => {};

  return { getInitInfo, createStockTakeSheet };
};
