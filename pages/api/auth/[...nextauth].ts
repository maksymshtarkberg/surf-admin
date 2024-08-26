import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type User = {
  id: string;
  name: string;
};

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.SECRET,
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        name: { label: "Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          process.env.NEXT_PUBLIC_USERNAME === credentials?.name &&
          process.env.NEXT_PUBLIC_PASSWORD === credentials?.password
        ) {
          return { name: process.env.NEXT_PUBLIC_USERNAME } as User;
        }
        return null;
      },
    }),
  ],
});
