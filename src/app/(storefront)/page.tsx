// src/app/(storefront)/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Define a flexible interface based on what Prisma returns
interface Vehicle {
  id: string;
  marque?: string;
  modele?: string;
  annee?: number;
  prixJour?: number;
  image?: string;
  boiteVitesse?: string;
  carburant?: string;
  // Fallbacks for English names just in case
  make?: string;
  model?: string;
  dailyRate?: number;
  imageUrl?: string;
}

export default function StorefrontHomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/client/vehicles");
        if (!res.ok) throw new Error("Failed to load vehicles");
        const data = await res.json();
        setVehicles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Section */}
      <div className="bg-black text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Find Your Perfect Ride
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Premium car rentals for your next journey. Browse our fleet and book instantly.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
        ) : vehicles.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No vehicles available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((car) => {
              // Handle both French and English potential property names safely
              const brand = car.marque || car.make || "Unknown Brand";
              const model = car.modele || car.model || "Unknown Model";
              const price = car.prixJour || car.dailyRate || 0;
              const image = car.image || car.imageUrl || "https://images.unsplash.com/photo-1550314090-3ce5a5f36e86?auto=format&fit=crop&w=800&q=80"; // Fallback image

              return (
                <div key={car.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                    <img 
                      src={image} 
                      alt={`${brand} ${model}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{brand} {model}</h3>
                        {car.annee && <p className="text-sm text-gray-500">{car.annee}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-black">${price}</p>
                        <p className="text-xs text-gray-500">per day</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-6">
                      <Link 
                        href={`/book/${car.id}`}
                        className="block w-full text-center bg-gray-100 text-black py-3 rounded-xl font-medium hover:bg-black hover:text-white transition-colors"
                      >
                        View & Book
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}