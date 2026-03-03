import { NextResponse } from "next/server";

import { EXHIBIT_BY_ID_URL } from "@/config/constants/server";

import {
  TIMEOUT_MS,
  jsonError,
  parseUpstreamJson,
  mapFetchError,
} from "@/lib/server/apiProxy";
import { getAccessToken } from "@/lib/server/getAccessToken";

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const apiRes = await fetch(EXHIBIT_BY_ID_URL(id), {
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

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const token = await getAccessToken(req);

    if (!token) {
      return jsonError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const apiRes = await fetch(EXHIBIT_BY_ID_URL(id), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!apiRes.ok) {
      const parsed = await parseUpstreamJson(apiRes);

      if (parsed.ok) {
        return NextResponse.json(parsed.data, { status: apiRes.status });
      }
    }

    return NextResponse.json(null, { status: apiRes.status });
  } catch (error) {
    return mapFetchError(error);
  }
};
