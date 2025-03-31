import { NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

// Type assertion to handle the potential undefined value
const uri = process.env.MONGODB_URI as string

if (!uri || uri === "") {
    throw new Error("MongoDB connection string is required")
}

// Create a cached connection variable
let cachedClient: MongoClient | null = null

async function connectToDB() {
    if (cachedClient) {
        return cachedClient.db("vito-x").collection("users")
    }
    
    cachedClient = new MongoClient(uri)
    await cachedClient.connect()
    return cachedClient.db("vito-x").collection("users")
}

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
            return NextResponse.json(
                { error: "Invalid content type. Expected JSON." },
                { status: 400 }
            )
        }
        
        const body = await request.json()
        const { firstname, lastname, email, password } = body
        
        if (!firstname || !lastname || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            )
        }
        
        const usersCollection = await connectToDB()
        
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)
        
        // Create new user
        await usersCollection.insertOne({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            createdAt: new Date()
        })
        
        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        )
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}