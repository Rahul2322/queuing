import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class";

export const errorMiddleware = (
    error: ErrorHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
  
    return res.status(statusCode).json({
      success: false,
      message,
    });
  };