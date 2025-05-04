import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { RequestWithUser } from "../types/request";

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = uuidv4();
  const requestObject = req as RequestWithUser;
  requestObject.requestId = id;
  res.setHeader("X-Request-Id", id);
  next();
}
