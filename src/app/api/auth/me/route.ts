import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { USER_PROFILE_URL } from "@/config/constants/server";

export const GET = async () => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const apiRes = await fetch(USER_PROFILE_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!apiRes.ok) {
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: apiRes.status },
    );
  }

  const data = await apiRes.json();

  return NextResponse.json(data);
};

