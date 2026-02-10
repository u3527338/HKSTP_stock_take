import axios from "axios";
import { getCurrentUser } from "../function/helper";

const ENV: "DEV" | "PROD" = "DEV";

const CONFIG = {
  DEV: {
    GET_INFO:
      "https://defaultb3e19ac2e19244c890bd41acbfb3dc.db.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/06bf64f305b04702b5925a49c40203ce/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7ShCsmdvwCoGc6KFUlnv78iI7j7Rxtx7CYKNOnNyPpk",
    CREATE_STOCK_TAKE:
      "https://defaultb3e19ac2e19244c890bd41acbfb3dc.db.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/79cb87e6ab66453986bc3dcb2a0ebe46/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=UjlUIBcbFO0efg9brHkHxF8-bvhbdEXsmHRwR-7BKCw",
  },
  PROD: {
    GET_INFO:
      "https://defaultb3e19ac2e19244c890bd41acbfb3dc.db.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/bc6af838fb6a4446a265ce00248a68af/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=h9TNlxi9DnonysBnvcz-nc0BE8f3CNjdhaG4bHOaANY",
    CREATE_STOCK_TAKE:
      "https://defaultb3e19ac2e19244c890bd41acbfb3dc.db.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/9f55a5b89300457fb758bf198e92c399/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=JTtH2PpU0-qSkVS0G5uGz3s_HHSBh_y4lJutNsYa3Kk",
  },
};

export const useHttpRequest = (context: CodeInContext) => {
  const URL = CONFIG[ENV];
  const getInitInfo = async () => {
    const response = await axios.post(
      URL.GET_INFO,
      { email: getCurrentUser(context).email },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  };

  const createStockTakeSheet = async (data) => {
    const response = await axios.post(
      URL.CREATE_STOCK_TAKE,
      {
        email: getCurrentUser(context).email,
        data,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  };

  return { getInitInfo, createStockTakeSheet };
};
