import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { EXHIBITS_URL } from "@/config/constants/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  const apiRes = await fetch(`${EXHIBITS_URL}?page=${page}&limit=${limit}`);
  const data = await apiRes.json();

  return NextResponse.json(data, { status: apiRes.status });
};

export const POST = async (req: Request) => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.formData();

  const apiRes = await fetch(EXHIBITS_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  const data = await apiRes.json();

  return NextResponse.json(data, { status: apiRes.status });
};

