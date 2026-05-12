import { JWT_SECRET } from "@repo/backend-common/jwt";
import { NextFunction, Request,Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
interface decodeProps extends JwtPayload{
    userId:string
}
export const middleware =(req:Request,res:Response,next:NextFunction)=>{
        try {
            const auth=req.header("authorization");
            const authHeader= auth?.startsWith("Bearer ")?auth.substring(7):auth;
            if(typeof authHeader !=="string"){
                return res.status(411).json({
                    message:"Auth should be valid"
                })
            }
            const decode = jwt.verify(authHeader,JWT_SECRET) as decodeProps
           if(decode){
           
          
            (req as any).userId=decode.userId;

            next();
           }
        } catch (error) {
           return res.status(500).json({
            message:"Internal server down",
            error:error
           }) 
        }
}