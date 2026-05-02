// src/app/(storefront)/layout.tsx
import React from "react";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* You can add a public Navbar here later! */}
      <main className="flex-grow">
        {children}
      </main>
      {/* You can add a public Footer here later! */}
    </div>
  );
}