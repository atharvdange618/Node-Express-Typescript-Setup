import { Request, Response, NextFunction } from "express";

export function corsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req.header("origin");

  const allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
  }

  next();
}
