import { cookies } from "next/headers";

import type { User } from "@/types/User";
import { getSession } from "./sessionStore";

export async function getCurrentUser(): Promise<User | null> {
  const sid = (await cookies()).get("sid")?.value;

  if (!sid) {
    return null;
  }

  const session = await getSession(sid);

  if (!session) {
    return null;
  }

  return { id: session.userId, username: session.userName };
}

