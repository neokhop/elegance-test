import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.cookies;

  if (req.method !== "GET" || !cookie.user_id) {
    let response = "Method not allowed";
    if (!cookie.user_id) {
      response = "Please login first";
    }
    return res.status(500).json({
      status: "failure",
      response,
    });
  }

  const tx = await prisma.transaction.findMany({
    orderBy: {
      date: "desc",
    },
    where: {
      user_id: cookie.user_id,
    },
  });
  return res.status(200).json({
    status: "success",
    response: tx,
  });
};

export default Handler;
