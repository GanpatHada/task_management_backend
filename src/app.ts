import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import userRoutes from './routes/user.route'
import taskRoutes from './routes/task.route'
import errorHandler from "./middlewares/error.middleware";


const app=express();
app.use(cors())
app.use(helmet()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 


app.use('/api/v1/user',userRoutes);
app.use("/api/v1/task",taskRoutes)
app.use((error:any,req:Request,res:Response,next:NextFunction)=>{
    errorHandler(error,req,res,next)
});

export default app;

