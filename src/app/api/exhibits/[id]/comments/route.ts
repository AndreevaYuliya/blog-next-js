import { NextResponse } from "next/server";

import { COMMENTS_URL } from "@/config/constants/server";

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

    const apiRes = await fetch(COMMENTS_URL(id), {
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

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const token = await getAccessToken(req);

    if (!token) {
      return jsonError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const body = await req.json().catch(() => null);

    if (!body) {
      return jsonError(400, "Invalid request body", "BAD_REQUEST");
    }

    const apiRes = await fetch(COMMENTS_URL(id), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
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
