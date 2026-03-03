import { NextResponse } from "next/server";

import { LOGIN_URL } from "@/config/constants/server";
import { randomUUID } from "node:crypto";
import { setSession } from "@/lib/server/sessionStore";
import {
  jsonError,
  mapFetchError,
  parseUpstreamJson,
  TIMEOUT_MS,
} from "@/lib/server/apiProxy";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    if (!body) {
      return jsonError(400, "Invalid request body", "BAD_REQUEST");
    }

    const apiRes = await fetch(`${LOGIN_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const parsed = await parseUpstreamJson<{
      access_token: string;
      refresh_token: string;
      userId: number;
      userName: string;
      message?: string;
    }>(apiRes);

    if (!parsed.ok) {
      return jsonError(502, "Invalid upstream response", parsed.code);
    }

    if (!apiRes.ok) {
      return jsonError(
        apiRes.status,
        parsed.data.message ?? "Login failed",
        "LOGIN_FAILED",
      );
    }

    const sid = randomUUID();

    await setSession(sid, {
      accessToken: parsed.data.access_token,
      refreshToken: parsed.data.refresh_token,
      userId: parsed.data.userId,
      userName: parsed.data.userName,
    });

    const res = NextResponse.json(
      {
        access_token: parsed.data.access_token,
        refresh_token: parsed.data.refresh_token,
        userId: parsed.data.userId,
        userName: parsed.data.userName,
      },
      { status: 200 },
    );

    res.cookies.set("sid", sid, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    return mapFetchError(error);
  }
};
