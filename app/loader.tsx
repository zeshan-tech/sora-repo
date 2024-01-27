import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getUserFromCookie } from "./services/supabase/auth.server";
import { i18nCookie, i18next } from "./i18n";
import { getSelectorsByUserAgent } from 'react-device-detect';
import { getClientIPAddress } from 'remix-utils/get-client-ip-address';
import { getClientLocales } from 'remix-utils/locales/server';
import { getToastSession } from './utils/server/toast-session.server';
import { getListGenre, getListLanguages } from './services/tmdb/tmdb.server';
import { combineHeaders } from "./utils";

export default async function loader({ request }: LoaderFunctionArgs) {
    const locale = await i18next.getLocale(request);
    const gaTrackingId = process.env.GA_TRACKING_ID;
    const user = await getUserFromCookie(request.headers.get('Cookie') || '');
    const deviceDetect = getSelectorsByUserAgent(request.headers.get('User-Agent') || '');
    const ipAddress = getClientIPAddress(request);
    const locales = getClientLocales(request);
    const nowDate = new Date();
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const toast = getToastSession(request);
    const message = await toast.getMessage();
  
    return json(
      {
        user: user || undefined,
        locale,
        genresMovie: await getListGenre('movie', locale),
        genresTv: await getListGenre('tv', locale),
        languages: await getListLanguages(),
        gaTrackingId,
        deviceDetect,
        ENV: {
          NODE_ENV: process.env.NODE_ENV,
          VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
          RESPONSIVE_IMAGES: 'ON',
          IMAGE_PROXY: process.env.IMAGE_PROXY,
        },
        ipAddress,
        locales,
        nowDate: formatter.format(nowDate),
        message,
      },
      {
        headers: combineHeaders(
          new Headers({
            'Set-Cookie': await i18nCookie.serialize(locale),
          }),
          new Headers({
            'Set-Cookie': await toast.commit(),
          }),
        ),
      },
    );
  };
  