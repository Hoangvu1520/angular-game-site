const httpHandler = async (url: string, body: any, method?: string) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_API + url, {
      method: method ? method : "POST",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
      body: method == "GET" ? undefined : JSON.stringify(body),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export default httpHandler;

const apiQRCode = async (
  amount: number,
  accountNo: string | number,
  accountName: string,
  addInfo: string,
  bin?: number
) => {
  return await fetch("https://api.vietqr.io/v2/generate", {
    method: "POST",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "X-Client-Id": process.env.NEXT_PUBLIC_VIETQR_CLIENT_ID
        ? process.env.NEXT_PUBLIC_VIETQR_CLIENT_ID
        : "",
      "X-Api-Key": process.env.NEXT_PUBLIC_VIETQR_API_KEY
        ? process.env.NEXT_PUBLIC_VIETQR_API_KEY
        : "",
    },
    body: JSON.stringify({
      accountNo: accountNo,
      accountName: accountName,
      acqId: bin ? bin : process.env.NEXT_PUBLIC_VIETABANK_BIN,
      amount: amount,
      addInfo: addInfo,
      format: "text",
      template: "compact2",
    }),
  })
    .then(async (res) => {
      return await res.json();
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export { apiQRCode };
