import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
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

  const user = await prisma.user.findFirst({ where: { username: body.username } });
  if (!user) return res.status(401).send({ message: "Invalid user or password" });

  const isValid = await bcrypt.compare(body.password, user.password);
  if (!isValid) return res.status(401).send({ message: "Invalid user or password" });

  return res
    .status(200)
    .setHeader("Set-Cookie", `user_id=${user.id}; HttpOnly; Secure; Path=/; SameSite=None`)
    .json({ status: "success" });
};

export default Handler;
