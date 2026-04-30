// src/app/api/client/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cin, firstName, lastName, email, phone, password } = body;

    // 1. Basic validation
    if (!cin || !firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All required fields must be provided" }, 
        { status: 400 }
      );
    }

    // 2. Check for existing client by email or CIN to prevent duplicates
    const existingClient = await prisma.client.findFirst({
      where: {
        OR: [{ email }, { cin }],
      },
    });

    if (existingClient) {
      return NextResponse.json(
        { error: "A client with this email or CIN already exists" }, 
        { status: 409 }
      );
    }

    // 3. Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the new client
    const newClient = await prisma.client.create({
      data: {
        cin,
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
      },
    });

    // 5. Remove password from the response for security
    const { password: _, ...clientData } = newClient;

    return NextResponse.json(
      { message: "Registration successful", client: clientData }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}