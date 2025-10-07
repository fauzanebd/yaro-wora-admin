import type * as API from "@/types/api";
import { apiFetch } from "./base";
// Profile API
export default {
  get: async () => {
    return apiFetch<API.Profile>("/profile");
  },
  update: async (profile: Partial<API.Profile>) => {
    return apiFetch<API.Profile>("/admin/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  },
};
