import { NextResponse } from "next/server";

import path from "node:path";
import dns from "node:dns/promises";
import net from "node:net";
import { readFile } from "node:fs/promises";

export const runtime = "nodejs";

const FALLBACK_PATH = "/fallback.jpg";

const REQUEST_TIMEOUT_MS = 5000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

const IS_DEV = process.env.NODE_ENV === "development";

const HOST_RULES: Record<
  string,
  { protocol: "http:" | "https:"; port?: string; pathPrefixes: string[] }
> = {
  "playground.zenberry.one": {
    protocol: "https:",
    pathPrefixes: ["/static/"],
  },
  ...(IS_DEV
    ? {
        localhost: {
          protocol: "http:",
          port: "3000",
          pathPrefixes: ["/static/", "/uploads/"],
        },
        "127.0.0.1": {
          protocol: "http:",
          port: "3000",
          pathPrefixes: ["/static/", "/uploads/"],
        },
      }
    : {}),
};

const getFallbackResponse = async (req: Request) => {
  try {
    const filePath = path.join(process.cwd(), "public", "fallback.jpg");
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    });
  } catch {
    return NextResponse.redirect(new URL(FALLBACK_PATH, req.url));
  }
};

const isPrivateIp = (ip: string): boolean => {
  const v = net.isIP(ip);

  if (v === 4) {
    const [a, b] = ip.split(".").map(Number);

    if (a === 10) {
      return true;
    }

    if (a === 127) {
      return true;
    }

    if (a === 0) {
      return true;
    }

    if (a === 169 && b === 254) {
      return true;
    }

    if (a === 192 && b === 168) {
      return true;
    }

    if (a === 172 && b >= 16 && b <= 31) {
      return true;
    }

    return false;
  }

  if (v === 6) {
    const s = ip.toLowerCase();

    if (s === "::1") {
      return true;
    }

    if (s.startsWith("fc") || s.startsWith("fd")) {
      return true; // ULA
    }

    if (s.startsWith("fe80")) {
      return true; // link-local
    }

    return false;
  }

  return true;
};

const buildAndValidateUrl = async (rawUrl: string): Promise<URL> => {
  const baseUrl = process.env.API_BASE_URL;

  const url =
    rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? new URL(rawUrl)
      : baseUrl
        ? new URL(rawUrl, baseUrl)
        : (() => {
            throw new Error("Relative URL is not allowed without API_BASE_URL");
          })();

  if (url.username || url.password) {
    throw new Error("Credentials in URL are not allowed");
  }

  const rule = HOST_RULES[url.hostname];
  if (!rule) {
    throw new Error("Host is not allowed");
  }

  if (url.protocol !== rule.protocol) {
    throw new Error("Protocol is not allowed for this host");
  }

  const effectivePort = url.port || (url.protocol === "https:" ? "443" : "80");

  if (rule.port && effectivePort !== rule.port) {
    throw new Error("Port is not allowed for this host");
  }

  if (!rule.pathPrefixes.some((prefix) => url.pathname.startsWith(prefix))) {
    throw new Error("Path is not allowed for this host");
  }

  const isLocalHost =
    url.hostname === "localhost" || url.hostname === "127.0.0.1";

  if (isLocalHost && !IS_DEV) {
    throw new Error("localhost is forbidden outside development");
  }

  // DNS/private-IP check only for non-local hosts
  if (!isLocalHost) {
    const records = await dns.lookup(url.hostname, {
      all: true,
      verbatim: true,
    });

    if (!records.length) {
      throw new Error("DNS lookup failed");
    }

    for (const record of records) {
      if (isPrivateIp(record.address)) {
        throw new Error("Private/internal IP is blocked");
      }
    }
  }

  return url;
};

const fetchWithLimit = async (url: URL) => {
  const upstream = await fetch(url.toString(), {
    method: "GET",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    redirect: "manual",
  });

  if (upstream.status >= 300 && upstream.status < 400) {
    throw new Error("Redirects are not allowed");
  }

  if (!upstream.ok) {
    throw new Error("Upstream returned non-OK status");
  }

  const contentType = upstream.headers.get("content-type");
  if (!contentType?.startsWith("image/")) {
    throw new Error("Only image content is allowed");
  }

  const declaredLengthRaw = upstream.headers.get("content-length");
  if (declaredLengthRaw) {
    const declaredLength = Number(declaredLengthRaw);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_IMAGE_BYTES) {
      throw new Error("Image is too large");
    }
  }

  const reader = upstream.body?.getReader();
  if (!reader) {
    throw new Error("Upstream body is empty");
  }

  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    if (!value) {
      continue;
    }

    total += value.byteLength;
    if (total > MAX_IMAGE_BYTES) {
      await reader.cancel();

      throw new Error("Image is too large");
    }

    chunks.push(value);
  }

  const body = Buffer.concat(chunks.map((c) => Buffer.from(c)));

  return { body, contentType };
};

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return getFallbackResponse(req);
    }

    const safeUrl = await buildAndValidateUrl(imageUrl);
    const { body, contentType } = await fetchWithLimit(safeUrl);

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    });
  } catch {
    return getFallbackResponse(req);
  }
};
