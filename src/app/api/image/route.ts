import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

const FALLBACK_PATH = "/fallback.jpg";

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

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return getFallbackResponse(req);
  }

  const baseUrl = process.env.API_BASE_URL;

  const normalizedUrl = imageUrl.startsWith("http")
    ? imageUrl
    : baseUrl
      ? new URL(imageUrl, baseUrl).toString()
      : imageUrl;

  try {
    const upstream = await fetch(normalizedUrl, { method: "GET" });

    if (!upstream.ok) {
      return getFallbackResponse(req);
    }

    const contentType = upstream.headers.get("content-type");

    if (!contentType?.startsWith("image/")) {
      return getFallbackResponse(req);
    }

    const arrayBuffer = await upstream.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    });
  } catch {
    return getFallbackResponse(req);
  }
};

