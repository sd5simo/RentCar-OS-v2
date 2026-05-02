// src/app/api/clients/reservations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_please_change_in_production"
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const vehicleId = searchParams.get("vehicleId");

  if (!vehicleId) {
    return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        vehicleId: vehicleId,
        status: {
          notIn: ["CANCELLED", "REJECTED"],
        },
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return NextResponse.json({ error: "Failed to fetch dates" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = cookies().get("client_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "You must be logged in to book a car" }, { status: 401 });
    }

    let clientId;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      clientId = payload.id as string;
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const body = await req.json();
    const { vehicleId, startDate, endDate, totalPrice } = body;

    const newReservation = await prisma.reservation.create({
      data: {
        clientId: clientId,
        vehicleId: vehicleId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: Number(totalPrice), // <-- THIS MUST BE 'totalPrice' 
        status: "PENDING",
      },
    });
    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 });
  }
}