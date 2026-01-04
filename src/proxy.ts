import { type NextRequest, NextResponse } from "next/server";

const publicPaths = ["/auth/login", "/auth/callback"];

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return redirectToLogin(request, pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
