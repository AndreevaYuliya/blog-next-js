import { NextResponse } from "next/server";
import { USER_PROFILE_URL } from "@/config/constants/server";
import {
  jsonError,
  mapFetchError,
  parseUpstreamJson,
  TIMEOUT_MS,
} from "@/lib/server/apiProxy";
import { getAccessToken } from "@/lib/server/getAccessToken";

export const GET = async (req: Request) => {
  try {
    const token = await getAccessToken(req);

    if (!token) {
      return jsonError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const apiRes = await fetch(USER_PROFILE_URL, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const parsed = await parseUpstreamJson<{
      id: number;
      username: string;
      message?: string;
    }>(apiRes);

    if (!parsed.ok) {
      return jsonError(502, "Invalid upstream response", parsed.code);
    }

    if (!apiRes.ok) {
      return jsonError(
        apiRes.status,
        parsed.data.message ?? "Failed to load profile",
        "PROFILE_FETCH_FAILED",
      );
    }

    return NextResponse.json(parsed.data, { status: 200 });
  } catch (error) {
    return mapFetchError(error);
  }
};
