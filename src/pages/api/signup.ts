import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
const saltRounds = 10;

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(500).json({
      status: "failure",
      response: "Method not allowed",
    });
  }

  if (!req?.body) {
    return res.status(500).json({
      status: "failure",
      response: "Invalid request",
    });
  }
  const body = req.body;

  const hashedPassword = await bcrypt.hash(body.password, saltRounds);

  const user = await prisma.user.create({
    data: {
      username: body.username,
      password: hashedPassword,
    },
  });

  res.status(200).json({
    status: "success",
    response: user,
  });
};

export default Handler;
