import { Links, Meta, Scripts, useLoaderData, useLocation } from "@remix-run/react";
import * as gtag from "./utils/client/gtags.client";
import loader from "./loader";
import { useTranslation } from "react-i18next";
import { useIsBot } from "./context/isbot.context";
import { useHydrated } from "./hooks/useHydrated";
import { useEffect, useMemo } from "react";
import { LiveReload, useSWEffect } from "@remix-pwa/sw";
import ElementScrollRestoration from "./ElementScrollRestoration";
import useLoadingIndicator from "./hooks/useLoadingIndicator";

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

export default function Document({ children, title }: Readonly<DocumentProps>) {
  const location = useLocation();
  const { locale, gaTrackingId, ENV } = useLoaderData<typeof loader>() ?? {};
  const { i18n } = useTranslation();
  const isBot = useIsBot();
  const isHydrated = useHydrated();
  useLoadingIndicator();
  const color = useMemo(() => {
    if (isHydrated) {
      return getComputedStyle(document.documentElement).getPropertyValue("--theme-background-title-bar");
    }
    return "0 0 0";
  }, [isHydrated]);

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  useSWEffect();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {title ? <title>{title}</title> : null}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="darkreader-lock" content="disable darkreader" />
        <meta name="msvalidate.01" content="1445DD7580898781011249BF246A21AD" />
        <meta name="theme-color" content={`hsl(${color})`} />
        <Meta />
        <Links />
      </head>
      <body>
        {!gaTrackingId || isBot ? null : (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`} />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
  
                    gtag('config', '${gaTrackingId}', {
                      page_path: window.location.pathname,
                    });
                  `,
              }}
            />
          </>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = ${JSON.stringify({
              env: ENV,
            })}`,
          }}
        />
        {children}
        <ElementScrollRestoration elementQuery="[data-restore-scroll='true']" />
        {isBot ? null : <Scripts />}
        <LiveReload />
      </body>
    </html>
  );
}
