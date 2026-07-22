import type { NextApiRequest, NextApiResponse } from "next";
import { connect, getCandles } from "tradingview-ws";
type ResponseData = {
  currentPrice: number | string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  (async function () {
    const connection = await connect();
    const candles: any = await getCandles({
      connection,
      symbols: ["XAUUSD"],
      amount: 1,
      timeframe: 1,
    });
    // await connection.close()
    // console.log(candles[0][0])
    const currentPrice =
      (parseFloat(candles[0][0].high) +
        parseFloat(candles[0][0].low)) /
      2;
    res.status(200).json({ currentPrice: currentPrice.toFixed(2) });
  })();
}
