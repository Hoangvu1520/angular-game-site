import { NextResponse, NextRequest } from "next/server";
export const middleware = async (request: NextRequest) => {
  const res = NextResponse.next();
  const token = await request.cookies.get("Access_token")?.value;
  const startPathCondition = request.nextUrl.pathname.startsWith("/auth")
  return await fetch(process.env.NEXT_PUBLIC_BASE_API + "/auth/check-auth", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': token ? `Bearer ${token}` : ''
    },
  }).then(async (respone: any) => {
    const auth = await respone.json();
    if (auth?.error) {
      return startPathCondition ? res : NextResponse.redirect(
        new URL("/auth/login", request.url)
      )
    }
    if (
      startPathCondition &&
      auth.message && auth.user.internal
    ) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }
    return res;
  }).catch(() => {
    return startPathCondition ? NextResponse.next() : NextResponse.redirect(
      new URL("/auth/login", request.url)
    )
  });
};
export const config = {
  matcher: [
    "/auth/:path*",
    "/cms_ums/:path*",
    "/cms_ims/:path*",
    "/",
    '/api/:path*'
  ],
}
