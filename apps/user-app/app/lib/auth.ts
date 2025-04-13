import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "@repo/db";

export const authOptions = {
    providers: [
    CredentialsProvider({
        name: 'Phone Number',
        credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
            password: { label: "Password", type: "password", required: true }
        },
        // TODO: User credentials type from next-aut
        async authorize(credentials: any) {
            // Do zod validation, OTP validation here
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser = await prisma.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        phone: existingUser.number
                    }
                }
                return null;
            }

            try {
                const user = await prisma.user.create({
                    data: {
                        number: credentials.phone,
                        password: hashedPassword
                    }
                });

                await prisma.balance.create({
                    data:{
                        userId:user.id,
                        amount:0,
                        locked:0
                    }
                })
            
                return {
                    id: user.id.toString(),
                    name: user.name,
                    phone: user.number
                }
            } catch(e) {
                console.error(e);
            }

            return null
        },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async jwt({token, user}:any){
            if(user){
                token.phone = user.phone
            }
            return token;
        },
        async session({ token, session }: any) {
            session.user.id = token.sub;
            session.user.phone = token.phone;

            return session
        }
    }
}