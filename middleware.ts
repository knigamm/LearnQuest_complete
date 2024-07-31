import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import getSession from "./app/util/getsession";
import { UserData } from "./app/util/types";
import getuserdetails from "./app/util/getuserdetails";

const isProtected = (path: string) => {
  if (
    ["/login", "/signup", "/"].includes(path) ||
    path.startsWith("/search")
  ) {
    return false;
  }
  return true;
};

export async function middleware(request: NextRequest) {
  const sessionData = getSession();
  const userdetails: UserData = await getuserdetails();

  if (isProtected(request.nextUrl.pathname) && !sessionData) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (["/login", "/signup"].includes(request.nextUrl.pathname) && sessionData) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (request.nextUrl.pathname === "/" && userdetails?.is_instructor) {
    return NextResponse.redirect(new URL("/instructor", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
