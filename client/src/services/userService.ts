import { createApiService } from "@/lib/createApiService";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const userService = createApiService<User>("/users");
