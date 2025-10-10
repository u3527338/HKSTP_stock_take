import axios from "axios";

export const useHttpRequest = (context: CodeInContext) => {
  const AZURE_URL = "";

  const getInitInfo = async () => {
    const response = await axios.post(AZURE_URL, {
      email: "chrissie.kwan@hkstp.org",
      // email: getCurrentUser(context).email,
    });
    console.log(response);
    return response.data;
  };

  const createStockTakeSheet = async (body) => {};

  return { getInitInfo, createStockTakeSheet };
};
