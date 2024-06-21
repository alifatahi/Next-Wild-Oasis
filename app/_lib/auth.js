import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // If login then Authorized is True
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    // Function to Create/Check Guest user
    async signIn({ user, account, profile }) {
      try {
        // Check if user exist
        const existingGuest = await getGuest(user.email);

        // If not then we will create new user
        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name });

        return true;
      } catch (error) {
        return false;
      }
    },
    // Add GuestID to our Session so we have access to it on entire app
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session;
    },
  },
  // Here is the login route
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
