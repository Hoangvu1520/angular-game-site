import ReactDOMServer from "react-dom/server";
import { Emailbill } from "../components";

interface payment {
  dayTrading?: string;
  dayPayment?: string;
  singleType?: string;
  quantity?: number;
  unitPrice?: number | string;
  fee?: number;
  totalPrice?: number;
}

interface information {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}
interface type {
  mail: string;
  payment: payment[];
  information: information;
}

const sendMail = async (type: type) => {
  const htmlString: string = ReactDOMServer.renderToStaticMarkup(
    <Emailbill
      payment={type.payment}
      information={type.information}
    />
  );
  const reponse = await fetch("/api/sendmail", {
    method: "POST",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      mail: type.mail,
      message: htmlString,
    }),
  });

  return reponse;
};

export default sendMail;
