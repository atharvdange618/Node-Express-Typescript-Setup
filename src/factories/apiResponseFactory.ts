import { ApiResponse } from "../utils/ApiResponse";

export const ok = <T>(data: T, message = "OK") =>
  new ApiResponse<T>(200, data, message);

export const created = <T>(data: T, message = "Created") =>
  new ApiResponse<T>(201, data, message);

export const noContent = (message = "No Content") =>
  new ApiResponse<null>(204, null, message);
