import { NextResponse } from "next/server";
import { REGISTER_URL } from "@/config/constants/server";
import {
  jsonError,
  parseUpstreamJson,
  TIMEOUT_MS,
} from "@/lib/server/apiProxy";

export const POST = async (req: Request) => {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return jsonError(400, "Invalid request body", "BAD_REQUEST");
    }

    const apiRes = await fetch(REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const parsed = await parseUpstreamJson(apiRes);

    if (!parsed.ok) {
      return NextResponse.json(
        { message: "Invalid upstream response", code: parsed.code },
        { status: 502 },
      );
    }

    return NextResponse.json(parsed.data, { status: apiRes.status });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "TimeoutError";

    return NextResponse.json(
      {
        message: isTimeout ? "Upstream timeout" : "Upstream unavailable",
        code: isTimeout ? "UPSTREAM_TIMEOUT" : "UPSTREAM_NETWORK_ERROR",
      },
      { status: isTimeout ? 504 : 502 },
    );
  }
};
