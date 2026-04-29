"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Tous les champs sont requis.");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    
    const ok = login(username, password);
    setLoading(false);
    if (ok) {
      router.push("/dashboard/statistiques");
    } else {
      setError("Identifiants incorrects. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 relative font-sans">
      
      {/* Background Gradient & Subtle Lighting to match the deep ocean vibe */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0c1220]" />
        {/* Top central soft light - Green #36AF62 */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vw] bg-[#36AF62]/15 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[420px]">
        
        {/* The Card Container */}
        <div className="relative rounded-[32px] bg-gradient-to-b from-white/[0.08] to-transparent p-[1px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Intense top edge light - Green #36AF62 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[2px] bg-gradient-to-r from-transparent via-[#36AF62] to-transparent opacity-80 blur-[1px]" />
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-[30%] h-[20px] bg-[#36AF62]/30 blur-xl" />

          {/* Inner Card Background with Frosted Glass & Noise */}
          <div className="relative bg-[#162032]/60 backdrop-blur-xl rounded-[31px] px-8 py-10 overflow-hidden h-full">
            
            {/* Subtle noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center gap-2 px-4 py-2 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center backdrop-blur-sm relative z-10">
                <AlertCircle size={14} />
                <p>{error}</p>
              </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-8 relative z-10">
              
              {/* Logo Container (Agrandit : w-16 h-16 au lieu de w-12 h-12) */}
              <div className="w-16 h-16 rounded-2xl bg-[#1e2a40]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center mb-6 p-2.5">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain opacity-90"
                />
              </div>

              {/* Textes en français */}
              <h1 className="text-2xl font-medium text-slate-100 tracking-wide">Bienvenue</h1>
              <p className="text-slate-400 text-xs mt-2 font-medium">Veuillez saisir vos identifiants pour vous connecter.</p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleLogin} className="relative z-10">
              
              {/* Custom Input Block (Username/Email & Password & Submit Button combined) */}
              <div className="bg-[#1e293b]/70 rounded-2xl p-2 flex flex-col gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border border-white/[0.02]">
                
                {/* Username / Email Input */}
                <div className="px-3 pt-2 pb-1 border-b border-white/[0.05]">
                  <label className="text-[10px] text-slate-400 block mb-0.5 ml-1">Identifiant</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none px-1 pb-1"
                  />
                </div>

                {/* Password Input & Submit Button Row */}
                <div className="flex items-center justify-between px-3 py-1">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 block mb-0.5 ml-1">Mot de passe</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none px-1"
                    />
                  </div>
                  
                  {/* Small Square Submit Button - Green #36AF62 */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#36AF62] text-white shadow-[0_2px_10px_rgba(54,175,98,0.4)] hover:shadow-[0_4px_15px_rgba(54,175,98,0.6)] hover:bg-[#2d9151] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} strokeWidth={2.5} />}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}