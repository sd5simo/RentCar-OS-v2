// src/app/api/client/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

// Get secret from env, fallback for development only
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_please_change_in_production"
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" }, 
        { status: 400 }
      );
    }

    // 2. Find the client by email
    const client = await prisma.client.findUnique({
      where: { email },
    });

    // If no client is found, or the client was created by an admin without a password
    if (!client || !client.password) {
      return NextResponse.json(
        { error: "Invalid email or password" }, 
        { status: 401 }
      );
    }

    // 3. Verify the password
    const isPasswordValid = await bcrypt.compare(password, client.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" }, 
        { status: 401 }
      );
    }

    // 4. Check if the client is blacklisted
    if (client.isBlacklist) {
       return NextResponse.json(
        { error: "This account has been restricted. Please contact support." }, 
        { status: 403 }
      );
    }

    // 5. Generate the JWT Token
    const token = await new SignJWT({ 
        id: client.id, 
        email: client.email, 
        role: "client" // Distinguish from admin if needed
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // Token expires in 7 days
      .sign(JWT_SECRET);

    // 6. Set the HTTP-only secure cookie
    cookies().set("client_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/",
    });

    // 7. Return success without exposing the password hash
    const { password: _, ...clientData } = client;

    return NextResponse.json(
      { message: "Login successful", client: clientData }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}