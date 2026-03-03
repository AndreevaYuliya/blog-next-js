import { NextResponse } from "next/server";

import { DELETE_COMMENT_URL } from "@/config/constants/server";

import {
  TIMEOUT_MS,
  jsonError,
  parseUpstreamJson,
  mapFetchError,
} from "@/lib/server/apiProxy";
import { getAccessToken } from "@/lib/server/getAccessToken";

export const DELETE = async (
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; commentId: string }>;
  },
) => {
  try {
    const { id, commentId } = await params;
    const token = await getAccessToken(req);

    if (!token) {
      return jsonError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const apiRes = await fetch(DELETE_COMMENT_URL(id, commentId), {
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
