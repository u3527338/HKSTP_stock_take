import axios from "axios";

export const useHttpRequest = (context: CodeInContext) => {
  // const {
  //   URL_GET_STAFF,
  //   URL_POST_STAFF,
  //   URL_OFFLINE_PAYMENT,
  //   URL_GET_FMO_REMARK,
  //   URL_GET_COMPANIES,
  //   URL_GET_SMART_CARDS,
  //   URL_GET_INVOICE,
  //   URL_GET_SAP_DATA,
  //   URL_UPLOAD_FILE,
  //   URL_GET_BANK_ACCOUNT,
  //   URL_GET_BANK_LIST,
  //   URL_GET_PAYMENT_INFO,
  //   URL_REJECT,
  //   URL_EXPORT_DATA,
  // } = URL(context);

  const getToken = async () => {
    const response = await axios.post(
      "https://oauthasservices-c6c5ffda4.ap1.hana.ondemand.com/oauth2/api/v1/token?grant_type=client_credentials",
      {},
      {
        headers: {
          Authorization:
            "Basic " +
            btoa(
              "707bae50-a91b-3863-a2e4-79b165e4b06a" +
                ":" +
                "42010A0001021EDEAEE508AE760E9AD8"
            ),
        },
      }
    );
    return response.data;
  };

  const getLocation = async (
    token: string = "46f51e30a2a019eb1dbbf36947a71dbc"
  ) => {
    const response = await axios.get(
      "https://l200851-iflmap.hcisbp.ap1.hana.ondemand.com/http/GetStockTakeLocation",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response.data;
  };

  // const getStaffList = async (
  //   accountGUID = localStorage.getItem("company_id")
  // ) => {
  //   const response = await axios.post(
  //     URL_GET_STAFF,
  //     addVerificationToBody(postBody, context)
  //   );
  //   return response.data;
  // };

  // const postStaff = async ({ body }) => {
  //   const response = await axios.post(URL_POST_STAFF, body);
  //   return response.data;
  // };

  return {
    getToken,
    getLocation
  };
};
