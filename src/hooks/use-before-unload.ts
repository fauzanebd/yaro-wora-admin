import { useEffect } from "react";

/**
 * Warns the user when attempting to reload/close the tab if `shouldBlock` is true.
 * Uses the native beforeunload prompt (browser-rendered with generic message).
 */
export function useBeforeUnload(shouldBlock: boolean) {
  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Modern browsers ignore custom strings and show a default message.
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldBlock]);
}
