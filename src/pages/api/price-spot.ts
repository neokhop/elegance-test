import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

import { priceSpotHandler } from "@/controllers/priceSpot";

const Handler = async (req: NextRequest, res: NextApiResponse) => {
  const data = await priceSpotHandler();
  res.status(200).json({
    status: data.status,
    response: data.response,
  });
};

export default Handler;
