import "server-only";
import { cookies } from "next/headers";
import { getSession } from "@/lib/server/sessionStore";

export const getAccessToken = async (req?: Request): Promise<string | null> => {
  const auth = req?.headers.get("authorization");

  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7).trim();

    if (token) {
      return token;
    }
  }

  const sid = (await cookies()).get("sid")?.value;

  if (!sid) {
    return null;
  }

  const session = await getSession(sid);

  return session?.accessToken ?? null;
};

