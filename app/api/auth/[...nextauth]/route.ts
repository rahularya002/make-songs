import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

// Fix the TypeScript error with type assertion
const uri = process.env.MONGODB_URI as string;

if (!uri || uri === "") {
    throw new Error("MongoDB connection string is required");
}

// Create a cached connection variable
let cachedClient: MongoClient | null = null;

async function connectToDB() {
    if (cachedClient) {
        return cachedClient.db("vito-x").collection("users");
    }
    
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
    return cachedClient.db("vito-x").collection("users");
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }
                
                try {
                    const usersCollection = await connectToDB();
                    const user = await usersCollection.findOne({ email: credentials.email });
                    
                    if (!user) {
                        throw new Error('No user found with this email');
                    }
                    
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    
                    if (!isPasswordValid) {
                        throw new Error('Invalid password');
                    }
                    
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: `${user.firstname} ${user.lastname}`
                    };
                } catch (error) {
                    console.error('Authentication error:', error);
                    throw new Error('Authentication failed');
                }
            }
        })
    ],
    pages: {
        signIn: '/auth',
        signOut: '/', // Redirect to home page after signout
        error: '/auth', // Error page
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
            }
            return session;
        }
    },
    debug: process.env.NODE_ENV === 'production', // Enable debug in development
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };