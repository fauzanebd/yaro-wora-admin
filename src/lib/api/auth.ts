import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Auth API
export default {
  login: async (username: string, password: string) => {
    return apiFetch<API.LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  getProfile: async () => {
    return apiFetch<API.AuthUser>("/admin/profile");
  },
};
