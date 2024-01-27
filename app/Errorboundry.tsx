import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import Document from "./Document";
import { ThemeProvider as RemixThemesProvider } from "next-themes";
import { Image as NextUIImage } from "@nextui-org/image";

export function ErrorBoundary() {
  const error = useRouteError();
  const isProd = process.env.NODE_ENV === "production";

  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = isProd ? "Oops! Looks like you tried to visit a page that you do not have access to." : error.data;
        break;
      case 404:
        message = isProd ? "Oops! Looks like you tried to visit a page that does not exist." : error.data;
        break;
      default:
        throw new Error(error.data || error.statusText);
    }
    return (
      <Document title={`${error.status} ${error.statusText}`}>
        <RemixThemesProvider defaultTheme="system" attribute="class" enableColorScheme enableSystem>
          <div className="flex h-screen flex-col items-center justify-center gap-y-4">
            <NextUIImage width={480} alt="404" className="object-cover" />
            <h1 className="text-center text-warning">
              {error.status} {error.statusText}
            </h1>
            <p>{message}</p>
            <div className="flex w-full flex-row items-center justify-center gap-x-4"></div>
          </div>
        </RemixThemesProvider>
      </Document>
    );
  } else if (error instanceof Error) {
    console.log(error);
    return (
      <Document title="Error!">
        <RemixThemesProvider defaultTheme="system" attribute="class" enableColorScheme enableSystem>
          <div className="flex h-screen flex-col items-center justify-center gap-y-4">
            <NextUIImage width={480} alt="404" className="object-cover" />
            <h1 className="text-center text-danger">There was an error</h1>
            <p>{error.message}</p>
            <div className="flex w-full flex-row items-center justify-center gap-x-4"></div>
          </div>
        </RemixThemesProvider>
      </Document>
    );
  } else {
    return (
      <Document title="Error!">
        <RemixThemesProvider defaultTheme="system" attribute="class" enableColorScheme enableSystem>
          <div className="flex h-screen flex-col items-center justify-center gap-y-4">
            <NextUIImage width={480} alt="404" className="object-cover" />
            <h1 className="text-center text-danger">Unknown error</h1>
            <div className="flex w-full flex-row items-center justify-center gap-x-4"></div>
          </div>
        </RemixThemesProvider>
      </Document>
    );
  }
}
