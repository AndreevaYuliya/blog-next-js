import { NextResponse } from "next/server";

export const POST = async () => {
  const res = NextResponse.json({ ok: true });

  res.cookies.set({
    name: "token",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return res;
};

