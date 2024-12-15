import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import PRICE_CONFIG from "@/config/price";
import { PriceRawItems } from "@/types/goldResp";

const convertToNumber = (value: string | number) => {
  if (typeof value === "string") {
    return parseInt(value, 10);
  }
  return value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateItem = (data: any[], oldName: string, newName: string) => {
  const newData = data.filter((item: PriceRawItems) => item.name === oldName);
  const result = newData.map((item: PriceRawItems) => {
    if (item.name === oldName) {
      return {
        ...item,
        name: newName,
        bid: convertToNumber(item.bid),
        ask: convertToNumber(item.ask),
      };
    }
  });
  return result.length > 0 ? result[0] : null;
};

const Handler = async (req: NextRequest, res: NextApiResponse) => {
  const response = await fetch(PRICE_CONFIG.URL);
  const statusCode = response.status;
  if (statusCode !== 200) {
    return {
      status: "failure",
      response: "Service is unavailable, Please try again later.",
    };
  }
  const data = await response.json();
  const association = updateItem(data, "สมาคมฯ", "association");
  const ninety_nine = updateItem(data, "99.99%", "ninety_nine");
  const updated = data.find((item: PriceRawItems) => item.name === "Update");

  res.status(200).json({
    status: "success",
    response: {
      date: updated?.bid || null,
      price: {
        association,
        ninety_nine,
      },
    },
  });
};

export default Handler;
