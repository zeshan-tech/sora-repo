import supabase from './client.server';
import { getSessionFromCookie } from "./cookie.server";


export const getUserFromCookie = async (cookie: string) => {
  const authCookie = await getSessionFromCookie(cookie);
  if (authCookie.has("auth_token")) {
    const authToken = authCookie.get("auth_token");
    const user = (await supabase.auth.getUser(authToken.access_token)).data.user || undefined;

    return user;
  }
};
