import { NextFunction, Request, Response } from "express";

export function handlerError(
  err: Error,
  res: Response,
  req: Request,
  next: NextFunction,
) {
  console.error("Something has gone wrong");
  res.status(500).json({
    error: "Something went wrong on our end",
  });
}
