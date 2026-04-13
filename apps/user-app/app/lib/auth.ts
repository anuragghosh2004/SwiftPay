import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { client } from "@repo/db/client";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

console.log("TESTING ENV LOAD: ", process.env.NEXTAUTH_SECRET);

export const auth_Options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        try {
          const existingUser = await client.user.findFirst({
            where: {
              number: credentials.phone
            }
          });

          if (existingUser) {
            const passwordValidation = await bcrypt.compare(
              credentials.password, 
              existingUser.password
            );
            
            if (passwordValidation) {
              return {
                id: existingUser.id.toString(),
                name: existingUser.name,
                email: existingUser.number
              };
            }
            return null;
          }

          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          
          const user = await client.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword
            }
          });

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.number
          };
          
        } catch (e) {
          console.error("Auth error:", e);
          return null;
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "secret",
  callbacks: {
    async session({ token, session }: { token: JWT, session: Session }) {
        if (session.user) {
            // ✅ THE FIX: We use "as any" to bypass TypeScript's strict check for this one specific line
            (session.user as any).id = token.sub as string;
        }
        return session;
    }
  },
  
};