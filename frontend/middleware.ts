import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = [
  "/all",
  "/contacts",
  "/favorites",
  "/search",
  "/tags",
  "/app-settings",
  "/user-settings",
];
const unprotectedRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/email-confirmation",
  "/email-sent",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get(".AspNetCore.Identity.Application");
  const requestedPath = request.nextUrl.pathname;

  if (
    protectedRoutes.some((route) => requestedPath.startsWith(route)) &&
    !cookie
  ) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (
    unprotectedRoutes.some((route) => requestedPath.startsWith(route)) &&
    cookie
  ) {
    return NextResponse.redirect(new URL("/all", request.nextUrl));
  }
}
