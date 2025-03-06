import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import ApiError from "../utils/apiError.utils";

interface AuthRequest extends Request {
    user?: { id: string; email: string }; 
}

const authMiddleware=(req:AuthRequest,res:Response,next:NextFunction)=>{
    try {
        const token=req.headers['authorization'];
        if(!token)
            throw new ApiError(400,"No token provider")     
        const decodedToken=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: string; email: string };
        req.user=decodedToken;
        next()
    } catch (error) {
        throw new ApiError(403,"Invalid or Expired token"+error)
    }
}

export default authMiddleware