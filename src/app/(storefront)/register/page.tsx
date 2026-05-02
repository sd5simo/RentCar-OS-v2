// src/app/(storefront)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    cin: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/clients/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // On success, redirect to the client login page (we will build this next)
      router.push("/client-login"); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-sm text-gray-500">Join us to book your next premium vehicle</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">First Name</label>
              <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="John" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Last Name</label>
              <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">CIN (ID Number)</label>
            <input required type="text" name="cin" value={formData.cin} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="e.g. AB123456" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="john@example.com" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Phone Number</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="+212 600 000 000" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Password</label>
            <input required type="password" name="password" value={formData.password} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="••••••••" />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/client-login" className="text-black font-medium hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}