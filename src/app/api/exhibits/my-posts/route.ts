import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { MY_POSTS_URL } from "@/config/constants/server";

export const GET = async (req: Request) => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  const apiRes = await fetch(`${MY_POSTS_URL}?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await apiRes.json();

  return NextResponse.json(data, { status: apiRes.status });
};

