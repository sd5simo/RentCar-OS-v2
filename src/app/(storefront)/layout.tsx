// src/app/(storefront)/layout.tsx
import Link from "next/link";
import { User, Menu, Search, Globe } from "lucide-react";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#36AF62]/30 selection:text-[#36AF62]">
      {/* 🟢 Top Navigation Bar (Airbnb Style) */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-[#36AF62]/10 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="RentCar-OS Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-[#36AF62] tracking-tight hidden sm:block">
              RentCar
            </span>
          </Link>

          {/* Center Search Pill (Minimal version for the header) */}
          <div className="hidden md:flex items-center shadow-sm border border-gray-200 rounded-full px-4 py-2 hover:shadow-md transition-shadow cursor-pointer">
            <span className="text-sm font-medium px-4 border-r border-gray-200">N'importe où</span>
            <span className="text-sm font-medium px-4 border-r border-gray-200">Une semaine</span>
            <span className="text-sm text-gray-500 px-4">Ajouter des dates</span>
            <div className="bg-[#36AF62] p-2 rounded-full text-white ml-2">
              <Search size={14} strokeWidth={3} />
            </div>
          </div>

          {/* Right User Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-full transition-colors">
              Mettre mon véhicule
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Globe size={18} />
            </button>
            
            {/* User Dropdown Button */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow cursor-pointer bg-white">
              <Menu size={18} className="ml-1 text-gray-500" />
              <div className="bg-gray-500 text-white rounded-full p-1">
                <User size={16} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🟢 Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} RentCar-OS. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}