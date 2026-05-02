// src/app/api/vehicles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET: Fetch all vehicles for the Admin Panel
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        // Corrected: Now matches the exact names in your schema.prisma
        damages: {
          orderBy: {
            date: "desc",
          },
        },
        reservations: true,
        rentals: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(vehicles, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin vehicles:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

// 2. POST: Create a new vehicle from the Admin Panel
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      make, 
      model, 
      registration, 
      year, 
      dailyRate, 
      mileage, 
      fuelType, 
      transmission, 
      imageUrl, 
      status 
    } = body;

    const newVehicle = await prisma.vehicle.create({
      data: {
        make,
        model,
        registration,
        year: Number(year),
        dailyRate: Number(dailyRate),
        mileage: mileage ? Number(mileage) : null,
        fuelType,
        transmission,
        imageUrl,
        status: status || "AVAILABLE",
      },
    });

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}