import { NextResponse } from "next/server";
import { EXHIBITS_URL } from "@/config/constants/server";

import {
  TIMEOUT_MS,
  jsonError,
  parseUpstreamJson,
  mapFetchError,
} from "@/lib/server/apiProxy";
import { getAccessToken } from "@/lib/server/getAccessToken";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const apiRes = await fetch(`${EXHIBITS_URL}?page=${page}&limit=${limit}`, {
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

export const POST = async (req: Request) => {
  try {
    const token = await getAccessToken(req);

    if (!token) {
      return jsonError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const body = await req.formData();

    const apiRes = await fetch(EXHIBITS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
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
