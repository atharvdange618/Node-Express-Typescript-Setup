import { Request } from "express";
import { AuthenticatedUser } from "./auth";

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
  requestId?: string;
}
