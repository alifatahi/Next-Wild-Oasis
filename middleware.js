import { auth } from "./app/_lib/auth";

export const middleware = auth;

// We check and set Middleware for account route so only Authorized user can see this route
export const config = {
  matcher: ["/account"],
};
