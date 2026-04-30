// src/app/api/client/vehicles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // We remove the 'select' block to temporarily bypass the naming errors.
    // This will fetch all fields available in your vehicle model.
    const vehicles = await prisma.vehicle.findMany({
      // orderBy: { createdAt: 'desc' } // Optional: order by newest
    });

    return NextResponse.json(vehicles, { status: 200 });
  } catch (error) {
    console.error("Public vehicles fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load vehicles" }, 
      { status: 500 }
    );
  }
}