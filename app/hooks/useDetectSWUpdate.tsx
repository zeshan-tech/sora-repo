import { LiveReload, logger, useSWEffect } from "@remix-pwa/sw";
import { useEffect, useState } from "react";

export default function useDetectSWUpdate() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  useEffect(() => {
    const detectSWUpdate = async () => {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration) {
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              console.log("🚀 ~ file: root.tsx:369 ~ registration.addEventListener ~ newWorker:", newWorker);
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                  logger.log("Service worker update found");
                  setWaitingWorker(newWorker);
                  setIsUpdateAvailable(true);
                }
              });
            }
          });
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setIsUpdateAvailable(true);
          }
        }
      }
    };
    detectSWUpdate();
  }, []);
  return {
    waitingWorker,
    isUpdateAvailable,
  };
}
