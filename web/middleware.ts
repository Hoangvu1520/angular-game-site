import { NextResponse, NextRequest } from "next/server";
export const middleware = async (request: NextRequest) => {
  const res = NextResponse.next();
  const token = await request.cookies.get("Access_token")?.value;
  const startPathCondition = (request.nextUrl.pathname.startsWith("/dang-nhap") ||
    request.nextUrl.pathname.startsWith("/dang-ky"))
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
        new URL("/dang-nhap", request.url)
      )
    }
    if (
      startPathCondition &&
      auth.message && auth.user.roles && auth.user.roles.length > 0 && auth.user.roles.find((role: string) => role == "admin" || role == "user")
    ) {
      return NextResponse.redirect(
        new URL("/gia-vang-vieta", request.url)
      );
    }
    return res;
  }).catch(() => {
    return startPathCondition ? NextResponse.next() : NextResponse.redirect(
      new URL("/dang-nhap", request.url)
    )
  });
};
export const config = {
  matcher: [
    "/doi-mat-khau",
    "/gia-vang-vieta",
    "/dang-nhap",
    "/",
    '/api/:path*'
  ],
}
