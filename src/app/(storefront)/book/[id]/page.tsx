// src/app/(storefront)/book/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  dailyRate: number;
  imageUrl?: string;
  year: number;
}

interface ReservedDate {
  startDate: string;
  endDate: string;
}

export default function BookVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [reservedDates, setReservedDates] = useState<ReservedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // 1. Fetch Vehicle and Reserved Dates on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vehicle details (we reuse the public list and find ours)
        const vRes = await fetch("/api/clients/vehicles");
        if (!vRes.ok) throw new Error("Failed to load vehicle");
        const vData: Vehicle[] = await vRes.json();
        const foundCar = vData.find((c) => c.id === vehicleId);
        if (!foundCar) throw new Error("Vehicle not found");
        setVehicle(foundCar);

        // Fetch already booked dates for this specific car
        const rRes = await fetch(`/api/clients/reservations?vehicleId=${vehicleId}`);
        if (rRes.ok) {
          const rData = await rRes.json();
          setReservedDates(rData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [vehicleId]);

  // 2. Dynamic Price Calculator & Date Validation
  useEffect(() => {
    setBookingError("");
    if (!startDate || !endDate || !vehicle) {
      setTotalPrice(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure dates are valid
    if (end < start) {
      setBookingError("Drop-off date cannot be before pick-up date.");
      setTotalPrice(0);
      return;
    }

    // Check against already booked dates (Prevent double-booking)
    const isOverlapping = reservedDates.some((res) => {
      const resStart = new Date(res.startDate);
      const resEnd = new Date(res.endDate);
      // Interval overlap logic
      return start <= resEnd && end >= resStart;
    });

    if (isOverlapping) {
      setBookingError("These dates are already booked for this vehicle. Please choose different dates.");
      setTotalPrice(0);
      return;
    }

    // Calculate Price
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalDays = diffDays === 0 ? 1 : diffDays; // Same day counts as 1 day
    setTotalPrice(totalDays * vehicle.dailyRate);

  }, [startDate, endDate, vehicle, reservedDates]);

  // 3. Handle Reservation Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingError || totalPrice === 0) return;
    
    setBookingLoading(true);
    setBookingError("");

    try {
      const res = await fetch("/api/clients/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          startDate,
          endDate,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        throw new Error("You must be logged in to book. Please sign in first.");
      }
      if (!res.ok) {
        throw new Error(data.error || "Failed to create reservation");
      }

      setBookingSuccess(true);
      // Wait 3 seconds, then redirect to home
      setTimeout(() => router.push("/"), 3000);
      
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format to prevent booking in the past
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">{error || "Vehicle not found"}</h2>
        <Link href="/" className="px-6 py-2 bg-black text-white rounded-lg">Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-gray-500 hover:text-black mb-8 inline-block transition-colors">
          &larr; Back to Fleet
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          
          {/* Left Side: Vehicle Details */}
          <div className="w-full md:w-1/2 bg-gray-100 relative">
            <img 
              src={vehicle.imageUrl || "https://images.unsplash.com/photo-1550314090-3ce5a5f36e86?auto=format&fit=crop&w=800&q=80"} 
              alt={`${vehicle.make} ${vehicle.model}`} 
              className="w-full h-64 md:h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
              <h1 className="text-3xl font-bold text-white mb-2">{vehicle.make} {vehicle.model}</h1>
              <p className="text-gray-200 text-lg">{vehicle.year} • Premium Class</p>
            </div>
          </div>

          {/* Right Side: Booking Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            {bookingSuccess ? (
              <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h2>
                <p className="text-gray-500">Your reservation has been successfully placed. Taking you back to the homepage...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900">Reserve Vehicle</h2>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-black">${vehicle.dailyRate}</span>
                    <span className="text-gray-500 text-sm"> / day</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Pick-up Date</label>
                      <input 
                        required 
                        type="date" 
                        min={today}
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Drop-off Date</label>
                      <input 
                        required 
                        type="date" 
                        min={startDate || today}
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  {bookingError && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                      {bookingError}
                    </div>
                  )}

                  <div className="bg-gray-50 p-6 rounded-2xl flex justify-between items-center mt-6">
                    <span className="font-medium text-gray-700">Estimated Total</span>
                    <span className="text-3xl font-bold text-black">${totalPrice.toFixed(2)}</span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={bookingLoading || !!bookingError || totalPrice === 0}
                    className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-black/20"
                  >
                    {bookingLoading ? "Processing..." : "Confirm Reservation"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}