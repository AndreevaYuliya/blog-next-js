import { NextResponse } from "next/server";

import { MY_POSTS_URL } from "@/config/constants/server";
import { getAccessToken } from "@/lib/server/getAccessToken";
import {
  jsonError,
  mapFetchError,
  parseUpstreamJson,
  TIMEOUT_MS,
} from "@/lib/server/apiProxy";

export const GET = async (req: Request) => {
  try {
    const token = await getAccessToken(req);

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const apiRes = await fetch(`${MY_POSTS_URL}?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const parsed = await parseUpstreamJson(apiRes);

    if (!parsed.ok) {
      return jsonError(502, "Invalid upstream response", parsed.code);
    }

    return NextResponse.json(parsed.data, { status: apiRes.status });
  } catch (error) {
    return mapFetchError(error);
  }
};
