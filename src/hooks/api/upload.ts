import { useMutation } from "@tanstack/react-query";
import { uploadAPI } from "@/lib/api";

export function useUploadFile() {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      uploadAPI.upload(file, folder),
  });
}
