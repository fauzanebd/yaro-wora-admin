import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Contact Info API
interface ContactInfoGetResponse {
  data: API.ContactInfo;
}
export const contactInfoAPI = {
  get: async () => {
    const response = await apiFetch<ContactInfoGetResponse>("/contact-info");
    return response.data;
  },
  update: async (data: API.ContactInfo) => {
    const response = await apiFetch<ContactInfoGetResponse>(
      "/admin/contact-info",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },
};

// Contact Content API
interface ContactContentGetResponse {
  data: API.ContactContent;
}
export const contactContentAPI = {
  get: async () => {
    const response = await apiFetch<ContactContentGetResponse>(
      "/contact-content"
    );
    return response.data;
  },
  update: async (data: API.ContactContent) => {
    const response = await apiFetch<ContactContentGetResponse>(
      "/admin/contact-content",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },
};

// Backward compatibility - keep the default export
export default {
  contactInfoAPI,
  contactContentAPI,
};
