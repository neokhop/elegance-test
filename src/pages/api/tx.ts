import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.cookies;
  if (!cookie.user_id) {
    return res.status(500).json({
      status: "failure",
      response: "Please login first",
    });
  }

  if (req.method === "GET") {
    const tx = await prisma.transaction.findMany({
      where: { user_id: cookie.user_id },
      orderBy: { date: "desc" },
    });
    return res.status(200).json({
      status: "success",
      response: tx,
    });
  }

  if (req.method === "POST") {
    if (!req?.body) {
      return res.status(500).json({
        status: "failure",
        response: "Invalid request",
      });
    }

    const body = req.body;

    const tx = await prisma.transaction.create({
      data: {
        symbol: body.symbol,
        state: body.state,
        amount: body.amount,
        quantity: body.quantity,
        price: body.price,
        date: body.date,
        user_id: cookie.user_id,
      },
    });

    return res.status(200).json({
      status: "success",
      response: tx,
    });
  }
  return res.status(500).json({
    status: "failure",
    response: "Method not allowed",
  });
};

export default Handler;
