import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Upload API
export default {
  upload: async (file: File, folder: string = "uploads") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    return apiFetch<API.UploadResponse>("/admin/content/upload", {
      method: "POST",
      body: formData,
    });
  },
};
