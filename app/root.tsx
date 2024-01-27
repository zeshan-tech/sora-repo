import { useLoaderData } from "@remix-run/react";
import { useHydrated } from "./hooks/useHydrated";
import { useIsBot } from "./context/isbot.context";
import { useToast } from "./utils/react/hooks/useToast";
import { Provider as WrapBalancerProvider } from "react-wrap-balancer";
import { useEffect } from "react";
import Image, { MimeType } from "remix-image";
import { NextUIProvider as NextUIv2Provider } from "@nextui-org/system";
import type { User } from '@supabase/supabase-js';
import loader from "./loader";
import useDetectSWUpdate from "./hooks/useDetectSWUpdate";
import { logger } from "@remix-pwa/sw";
import { ThemeProvider as RemixThemesProvider } from "next-themes";
import { toast } from "sonner";
import logoLoading from "./assets/images/logo_loading.png";
import Document from "./Document";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./routes/_index";
import Layout from "./layouts/Layout";

export default function App() {
  const isHydrated = useHydrated();
  const { user, message } = useLoaderData<typeof loader>() ?? {};
  const isBot = useIsBot();
  useToast(message);
  const { waitingWorker, isUpdateAvailable } = useDetectSWUpdate();

  useEffect(() => {
    const reloadPage = () => {
      logger.log("Service worker updated");
      waitingWorker?.postMessage("skipWaiting");
      window.location.reload();
    };
    if (isUpdateAvailable) {
      toast.success("Update Available", {
        description: "A new version of Sora is available.",
        action: {
          label: "Update",
          onClick: () => reloadPage(),
        },
        duration: Infinity,
      });
    }
  }, [isUpdateAvailable, waitingWorker]);

  console.log(isHydrated, process.env.NODE_ENV !== "development", isBot);

  return (
    <Document>
      <WrapBalancerProvider>
        <RemixThemesProvider defaultTheme="system" attribute="class" enableColorScheme enableSystem>
          <AnimatePresence>
            {!isHydrated && process.env.NODE_ENV !== "development" && !isBot ? (
              <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed left-0 top-0 z-[9999] block size-full bg-background">
                <div className="relative top-1/2 m-auto mt-[-77px] block size-0">
                  <div className="mb-5 flex	items-center justify-center">
                    <Image
                      width="100px"
                      height="100px"
                      className="mr-5 rounded-full"
                      title="Logo Loading"
                      alt="Logo Loading"
                      src={logoLoading}
                      placeholder="empty"
                      responsive={[
                        {
                          size: {
                            width: 100,
                            height: 100,
                          },
                        },
                      ]}
                      dprVariants={[1, 3]}
                      options={{
                        contentType: MimeType.WEBP,
                      }}
                    />
                    <h1 className="bg-gradient-to-tr from-secondary to-primary to-50% bg-clip-text !text-3xl font-bold tracking-normal text-transparent md:!text-5xl">SORA</h1>
                  </div>
                  <div className="size-9 animate-spin">
                    <div className="size-full rounded-[50%] border-4 border-y-primary" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <Index />
            )}
          </AnimatePresence>
          <NextUIv2Provider>
            <Layout user={user as User | undefined} />
          </NextUIv2Provider>
        </RemixThemesProvider>
      </WrapBalancerProvider>
    </Document>
  );
}
