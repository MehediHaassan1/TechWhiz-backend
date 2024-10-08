import axios from "axios";
import config from "../../config";

export const generateUniqueId = async (): Promise<string> => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const generateRandomString = (length: number): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const minIdLength = 16;
  const maxIdLength = 20;

  const totalLength = Math.floor(Math.random() * (maxIdLength - minIdLength + 1)) + minIdLength;

  const randomStringLength = totalLength - (year.length + month.length + 3); // 3 for "TW-"

  const randomString = generateRandomString(randomStringLength);

  const uniqueId = `TW-${year}${month}-${randomString}`;

  return uniqueId;
};

export const initiatePayment = async (payload) => {


  const paymentDataString = encodeURIComponent(JSON.stringify(payload));
  const response = await axios.post(config.PAYMENT_URL!, {
    store_id: config.Store_id,
    signature_key: config.SIGNATURE_KEY,
    tran_id: payload.trxID,
    success_url: `${config.Backend_URL}/api/v1/payment/confirmation?trxId=${payload.trxID}&status=success&paymentData=${paymentDataString}`,
    fail_url: `${config.Backend_URL}/api/v1/payment/confirmation?transactionId=${payload.trxID}&status=failed`,
    cancel_url: `${config.FrontEnd_URL}`,
    amount: payload.packagePrice,
    currency: "USD",
    desc: "Merchant Registration Payment",
    cus_name: payload?.name,
    cus_email: payload?.email,
    cus_add1: payload?.address || "N/A",
    cus_add2: payload?.address || "N/A",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1206",
    cus_country: "Bangladesh",
    cus_phone: payload?.phone,
    type: "json",
  });

  return response.data;
};


export const verifyPayment = async (trxId: string | undefined) => {

  console.log(trxId)

  try {
    const response = await axios.get('https://sandbox.aamarpay.com/api/v1/trxcheck/request.php', {
      params: {
        store_id: 'aamarpaytest',
        signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
        type: "json",
        request_id: trxId,
      },
    });

    console.log({ red: response.data })
    return response.data;
  } catch (err) {
    throw new Error("Payment validation failed!");
  }
};