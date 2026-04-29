// src/app/(storefront)/page.tsx
"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Car } from "lucide-react";
import Link from "next/link";

// Fake data to populate the grid initially. We will connect this to useStore later.
const MOCK_VEHICLES = [
  { id: "1", brand: "Peugeot", model: "208", category: "Économique", price: 300, image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800", rating: 4.8 },
  { id: "2", brand: "Volkswagen", model: "Golf 8", category: "Compacte", price: 450, image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800", rating: 4.9 },
  { id: "3", brand: "Mercedes", model: "Classe A", category: "Luxe", price: 800, image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800", rating: 5.0 },
  { id: "4", brand: "Dacia", model: "Duster", category: "SUV", price: 350, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800", rating: 4.5 },
];

export default function StorefrontHomePage() {
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In the next step, this will redirect to /search?location=...&dates=...
    console.log("Searching for:", { location, dates, vehicleType });
  };

  return (
    <div className="w-full">
      {/* 🔴 The Hero Section with the Big Search Bar */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
        
        <h1 className="text-4xl md:text-5xl font-black text-center text-slate-900 mb-8 tracking-tight">
          Trouvez la voiture parfaite <br className="hidden md:block" /> pour votre prochain voyage.
        </h1>

        {/* The Airbnb-style Search Pill */}
        <form 
          onSubmit={handleSearch}
          className="w-full max-w-4xl bg-white rounded-full shadow-[0_8px_28px_rgba(0,0,0,0.08)] border border-gray-200 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200 p-2 md:p-0 relative z-10"
        >
          {/* Location Input */}
          <div className="flex-1 px-6 py-3 hover:bg-gray-100 rounded-full transition-colors cursor-pointer group">
            <label className="block text-xs font-bold text-gray-800 tracking-wide">Lieu de prise en charge</label>
            <input 
              type="text" 
              placeholder="Rechercher une ville..." 
              className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400 mt-0.5"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Dates Input */}
          <div className="flex-1 px-6 py-3 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <label className="block text-xs font-bold text-gray-800 tracking-wide">Dates de location</label>
            <input 
              type="text" 
              placeholder="Ajouter des dates" 
              className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400 mt-0.5"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
            />
          </div>

          {/* Vehicle Type Input & Search Button */}
          <div className="flex-1 pl-6 pr-2 py-2 flex items-center justify-between hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <div className="w-full">
              <label className="block text-xs font-bold text-gray-800 tracking-wide">Type de véhicule</label>
              <input 
                type="text" 
                placeholder="Ex: Économique, SUV..." 
                className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400 mt-0.5"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              />
            </div>
            
            <button 
              type="submit"
              className="ml-4 flex-shrink-0 w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-3 bg-[#36AF62] text-white rounded-full flex items-center justify-center gap-2 hover:bg-[#2d9151] transition-colors shadow-md"
            >
              <Search size={18} strokeWidth={2.5} />
              <span className="hidden md:block font-bold">Rechercher</span>
            </button>
          </div>
        </form>
      </section>

      {/* 🔴 The Vehicle Grid (Airbnb Style Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Véhicules populaires</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_VEHICLES.map((car) => (
            <Link href={`/voiture/${car.id}`} key={car.id} className="group cursor-pointer flex flex-col">
              
              {/* Image Container with 1:1 Aspect Ratio (Square) */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
                <img 
                  src={car.image} 
                  alt={`${car.brand} ${car.model}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Wishlist Heart Icon (Optional visual flair) */}
                <button className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20 transition-colors">
                   <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" className="w-6 h-6 fill-black/50 stroke-white stroke-2"><path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"></path></svg>
                </button>
              </div>
              
              {/* Details Below Image */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">{car.brand} {car.model}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{car.category}</p>
                  <p className="mt-1 text-slate-900">
                    <span className="font-bold">{car.price} MAD</span> <span className="text-gray-900 font-normal">par jour</span>
                  </p>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">★</span>
                  <span className="text-sm text-gray-900">{car.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}