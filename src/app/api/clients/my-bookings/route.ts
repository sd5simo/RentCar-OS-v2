// src/app/api/clients/my-bookings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_please_change_in_production"
);

export async function GET(req: Request) {
  try {
    // 1. Verify the user is logged in
    const token = cookies().get("client_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let clientId;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      clientId = payload.id as string;
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 2. Fetch all reservations for this specific client
    const myBookings = await prisma.reservation.findMany({
      where: { 
        clientId: clientId 
      },
      include: {
        vehicle: true, // This tells Prisma to also grab the related Vehicle data!
      },
      orderBy: { 
        createdAt: 'desc' // Show newest bookings first
      }
    });

    return NextResponse.json(myBookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}