import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = {
  matcher: [
    "/",
    "/members/:path*",
    "/contributions/:path*",
    "/payments/:path*",
    "/reports/:path*",
  ],
}
