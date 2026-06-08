import { apiConfig } from "..";
interface InsertPaymentProps {
  message: string;
  orderId: string;
  userId: string;
  price: number;
  state: "+" | "-";
}
const InsertPayment = async (
  InsertPaymentProps: InsertPaymentProps
) => {
  return await apiConfig("/cms-invest/insert-payment", InsertPaymentProps);
};
export { InsertPayment };
