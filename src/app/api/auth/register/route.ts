import { NextResponse } from "next/server";

import { REGISTER_URL } from "@/config/constants/server";

export const POST = async (req: Request) => {
  const body = await req.json();

  const apiRes = await fetch(REGISTER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await apiRes.json();

  return NextResponse.json(data, { status: apiRes.status });
};

