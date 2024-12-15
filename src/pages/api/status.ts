import PriceStatus from "@/constants/status";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const status = await prisma.status.findFirst();
  if (!status) {
    const createStatus = await prisma.status.create({
      data: {
        spot: PriceStatus.ONLINE,
        ninety_nine_nine: PriceStatus.ONLINE,
        ninety_six_fifty: PriceStatus.ONLINE,
      },
    });
    if (!createStatus) {
      return res.status(500).json({
        status: "failure",
        response: "create status error",
      });
    }

    return res.status(200).json({
      status: "success",
      response: createStatus,
    });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      status: "success",
      response: status,
    });
  }

  if (!req?.body) {
    return res.status(500).json({
      status: "failure",
      response: "Invalid request",
    });
  }

  const body = req.body;

  if (req.method === "PATCH") {
    const updateStatus = await prisma.status.update({
      where: { id: body.id },
      data: {
        spot: body.spot,
        ninety_nine_nine: body.ninety_nine_nine,
        ninety_six_fifty: body.ninety_six_fifty,
      },
    });
    if (!updateStatus) {
      return res.status(500).json({
        status: "failure",
        response: "update status error",
      });
    }
    return res.status(200).json({
      status: "success",
      response: updateStatus,
    });
  }

  return res.status(500).json({
    status: "failure",
    response: "Method not allowed",
  });
};

export default Handler;
