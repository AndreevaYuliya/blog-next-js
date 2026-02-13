import { NextResponse } from "next/server";

import { LOGIN_URL } from "@/config/constants/server";

export const POST = async (req: Request) => {
  const body = await req.json();

  const apiRes = await fetch(`${LOGIN_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!apiRes.ok) {
    return NextResponse.json(
      { message: "Login failed" },
      { status: apiRes.status },
    );
  }

  const data = await apiRes.json();

  const res = NextResponse.json(
    {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      userId: data.user?.id,
      userName: data.user?.username,
    },
    { status: 200 },
  );

  res.cookies.set({
    name: "token",
    value: data.access_token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
};

