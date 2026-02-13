import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const middleware = (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);

    loginUrl.searchParams.set("from", req.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/home", "/new-post/:path*"],
};

export default middleware;

