import { JWT_SECRET } from "@repo/backend-common/jwt";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
interface decodeProps extends JwtPayload {
  userId: string;
}
export const middleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.cookies.token);
    const auth =req.cookies.token;
    console.log(auth);
    if (!auth) {
      return res.json({
        message: "Cookie not found",
      });
    }

    console.log(auth);
    const decode = jwt.verify(auth, JWT_SECRET);
    console.log(decode);
    if (decode) {
      //@ts-ignore
      req.userId = decode.userId;
      next();
    }
  } catch (error) {
    return res.status(411).json({
      message: "Internal Server down",
    });
  }
};
