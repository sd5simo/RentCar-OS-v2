// src/app/(storefront)/my-bookings/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await fetch("/api/clients/my-bookings");
        
        if (res.status === 401) {
          window.location.href = "/client-login"; // Redirect to login if not authenticated
          return;
        }
        
        if (!res.ok) throw new Error("Failed to load your reservations");
        
        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  // Helper function to render colorful status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide">PENDING APPROVAL</span>;
      case "APPROVED":
      case "ACTIVE":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide">CONFIRMED</span>;
      case "CANCELLED":
      case "REJECTED":
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide">CANCELLED</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <Link href="/" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Book Another Car
          </Link>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't reserved any vehicles yet.</p>
            <Link href="/" className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
              Browse Fleet
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
                
                {/* Vehicle Image */}
                <div className="w-full md:w-48 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={booking.vehicle?.imageUrl || "https://images.unsplash.com/photo-1550314090-3ce5a5f36e86?auto=format&fit=crop&w=800&q=80"} 
                    alt="Vehicle" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Booking Details */}
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {booking.vehicle?.make} {booking.vehicle?.model}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Booking Ref: #{booking.id.slice(-6).toUpperCase()}</p>
                    </div>
                    <div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pick-up</p>
                      <p className="font-semibold text-gray-900 mt-1">{new Date(booking.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Drop-off</p>
                      <p className="font-semibold text-gray-900 mt-1">{new Date(booking.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="md:w-32 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="text-2xl font-bold text-black">${booking.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
