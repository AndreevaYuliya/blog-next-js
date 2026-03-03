import { jsonError } from "@/lib/server/apiProxy";
import { deleteSession } from "@/lib/server/sessionStore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const sid = (await cookies()).get("sid")?.value;

    if (sid) {
      await deleteSession(sid);
    }

    const res = NextResponse.json(
      { ok: true, message: "Logged out", code: "LOGOUT_OK" },
      { status: 200 },
    );

    res.cookies.set("sid", "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch {
    return jsonError(500, "Failed to logout", "SESSION_STORE_ERROR");
  }
};
