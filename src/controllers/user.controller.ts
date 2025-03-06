import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.utils";
import ApiError from "../utils/apiError.utils";
import { pool } from "../config/db.config";
import ApiResponse from "../utils/apiResponse.utils";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET=process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET=process.env.REFRESH_TOKEN_SECRET



const generateTokens=(id:string)=>{
    const accessToken = jwt.sign({id}, ACCESS_TOKEN_SECRET as string, { expiresIn: "7d" });
    const refreshToken = jwt.sign({id}, REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });
    return {accessToken,refreshToken}
}

export const createUser=asyncHandler(async(req:Request,res:Response)=>{
    const { name, email, password } = req.body;
    if([name,email,password].some(field=> !field || field.length===0))
        throw new ApiError(400,"all fields are required");

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) 
        throw new ApiError(400,"user with this email already exists")
    try {
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
        const hashedPassword = await bcrypt.hash(password, 10);
        const values = [name, email, hashedPassword];
        await pool.query(query, values);
        return res.status(201).json(new ApiResponse(201,{},"user registered successfully"))
      } catch (error) {
        throw new ApiError(500,"unable to create user")
      }
})


export const login=asyncHandler(async(req:Request,res:Response)=>{
    const{email,password}=req.body;
    if([email,password].some(field=> !field || field.length===0))
        throw new ApiError(400,"all fields are required");
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) 
        throw new ApiError(400,"user with this email does not exists")
    const user = userResult.rows[0];
    const passwordMatch=await bcrypt.compare(password,user.password)
    if(!passwordMatch)
        throw new ApiError(400,"Password is incorrect")
    const{accessToken,refreshToken}=generateTokens(user.id);
    return res.status(200).json(new ApiResponse(200,{accessToken,refreshToken},"user logged in successfully"))

    
})

interface AuthRequest extends Request {
    user?: { id: string; email: string }; 
}

export const getUserDetails=asyncHandler(async(req:AuthRequest,res:Response)=>{
    const userId=req.user?.id;
    const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
        throw new ApiError(400,"user not found")
    }
    return res.status(200).json(new ApiResponse(200,{user:result.rows[0]},"details fetched successfully"))
})