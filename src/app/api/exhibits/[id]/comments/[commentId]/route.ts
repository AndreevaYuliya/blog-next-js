import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { DELETE_COMMENT_URL } from "@/config/constants/server";

export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) => {
  const { id, commentId } = await params;
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const apiRes = await fetch(DELETE_COMMENT_URL(id, commentId), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(null, { status: apiRes.status });
};
