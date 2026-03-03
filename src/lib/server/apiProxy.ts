import "server-only";
import { NextResponse } from "next/server";

export const TIMEOUT_MS = 8000;

export type UpstreamParseCode = "UPSTREAM_NON_JSON" | "UPSTREAM_INVALID_JSON";

export const jsonError = (status: number, message: string, code: string) =>
  NextResponse.json({ message, code }, { status });

export const parseUpstreamJson = async <T>(res: Response) => {
  const ct = res.headers.get("content-type") ?? "";

  if (!ct.includes("application/json")) {
    return {
      ok: false as const,
      code: "UPSTREAM_NON_JSON" as UpstreamParseCode,
    };
  }

  try {
    const data = (await res.json()) as T;

    return { ok: true as const, data };
  } catch {
    return {
      ok: false as const,
      code: "UPSTREAM_INVALID_JSON" as UpstreamParseCode,
    };
  }
};

export const mapFetchError = (error: unknown) => {
  const isTimeout = error instanceof Error && error.name === "TimeoutError";

  return isTimeout
    ? jsonError(504, "Upstream timeout", "UPSTREAM_TIMEOUT")
    : jsonError(502, "Upstream unavailable", "UPSTREAM_NETWORK_ERROR");
};

