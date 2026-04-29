"use client";
import { useDataLoader } from "@/hooks/useDataLoader";
import { Car, RefreshCw, AlertTriangle } from "lucide-react";

export default function DataLoader({ children }: { children: React.ReactNode }) {
  const { loading, error, reload } = useDataLoader();

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#05080f] flex flex-col items-center justify-center overflow-hidden font-sans">
        
        {/* 🟢 Ambiance Luxe - Lueur douce et respirante en arrière-plan */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#36AF62]/5 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* 🪟 Écrin de verre et Ondes (Ripple effect) */}
          <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
            
            {/* Onde lumineuse 1 */}
            <div className="absolute inset-0 rounded-[2rem] border border-[#36AF62]/40 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
            {/* Onde lumineuse 2 (Décalée) */}
            <div className="absolute inset-0 rounded-[2rem] border border-[#36AF62]/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '1.5s' }} />

            {/* Cadran central en verre poli */}
            <div className="relative z-10 w-20 h-20 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center p-3.5 overflow-hidden">
              {/* Reflet diagonal subtil sur le verre */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50" />
              
              <img 
                src="/logo.png" 
                alt="RentCar-OS Logo" 
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(54,175,98,0.4)]"
              />
            </div>
          </div>

          {/* ✨ Texte et 3 points (Minimaliste et Élégant) */}
          <div className="flex flex-col items-center space-y-4">
            
            <h1 className="text-slate-200 font-medium text-lg tracking-[0.3em] uppercase drop-shadow-md">
              RentCar<span className="text-[#36AF62] font-bold">OS</span>
            </h1>

            <div className="flex items-center gap-2.5">
              <span className="text-slate-500 text-[10px] font-semibold tracking-[0.2em] uppercase">
                Chargement
              </span>
              
              {/* 3 points élégants (Respiration douce au lieu de sauts agressifs) */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i} 
                    className="w-1.5 h-1.5 rounded-full bg-[#36AF62] shadow-[0_0_8px_rgba(54,175,98,0.6)]"
                    style={{ 
                      animation: `pulse-opacity 1.5s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Styles pour l'animation de respiration des points */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse-opacity {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `}} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">Erreur de connexion</p>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">
              Impossible de charger les données depuis la base de données.
            </p>
            <p className="text-red-400 text-xs mt-2 font-mono bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
              {error}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-slate-600 text-xs">Vérifiez que DATABASE_URL est configurée correctement.</p>
            <button onClick={reload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-green-600 hover:bg-brand-green-500 text-white text-sm font-semibold transition-colors mx-auto">
              <RefreshCw size={14} /> Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
