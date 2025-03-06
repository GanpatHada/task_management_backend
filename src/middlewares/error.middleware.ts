import {NextFunction, Request, Response} from "express";

interface CustomError extends Error{
    statusCode?: number;
    data?: any;
    success?: boolean;
    code?: number;
}

const errorHandler=(error: CustomError, req: Request, res: Response, next: NextFunction):Response=>{
    console.error(error.stack);
    return res
      .status(error.statusCode || 500)
      .json({
        message: error.message || "Internal Server Error",
        data: error.data || null,
        success: error.success ?? false,
        code: error.statusCode || 500,
      });
}

export default errorHandler