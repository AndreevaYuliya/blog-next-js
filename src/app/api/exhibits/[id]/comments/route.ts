import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { COMMENTS_URL } from "@/config/constants/server";

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  const apiRes = await fetch(COMMENTS_URL(id));
  const data = await apiRes.json();

  return NextResponse.json(data, { status: apiRes.status });
};

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();

  const apiRes = await fetch(COMMENTS_URL(id), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await apiRes.json();

  return NextResponse.json(data, { status: apiRes.status });
};

