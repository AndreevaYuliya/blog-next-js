import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { EXHIBIT_BY_ID_URL } from "@/config/constants/server";

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  const apiRes = await fetch(EXHIBIT_BY_ID_URL(id));
  const data = await apiRes.json();

  return NextResponse.json(data, { status: apiRes.status });
};

export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const apiRes = await fetch(EXHIBIT_BY_ID_URL(id), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(null, { status: apiRes.status });
};

