import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Profile API
interface ProfileGetResponse {
  data: API.ProfilePageContent;
}

export const profileAPI = {
  get: async () => {
    const response = await apiFetch<ProfileGetResponse>("/profile");
    return response.data;
  },
  update: async (data: API.ProfilePageContent) => {
    const response = await apiFetch<ProfileGetResponse>("/admin/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  },
};

// Backward compatibility - keep the default export
export default {
  profileAPI,
};
