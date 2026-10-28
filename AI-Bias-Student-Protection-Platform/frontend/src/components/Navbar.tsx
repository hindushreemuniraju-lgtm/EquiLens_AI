import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Cpu, Sparkles, Scale, Zap } from 'lucide-react';
import { api } from '../services/api';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [fairnessScore, setFairnessScore] = useState<number>(78.5);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(true);

  useEffect(() => {
    api.getOverviewStats()
      .then(stats => {
        setFairnessScore(stats.latest_fairness_health_index);
        setIsBackendOnline(true);
      })
      .catch(() => setIsBackendOnline(false));
  }, [location.pathname]);

  return (
    <header className="h-16 bg-[#0A0A0A]/95 border-b border-[#22222E] backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007BA7] to-[#FF2D95] p-0.5 shadow-cerulean-glow transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-[#007BA7] group-hover:text-[#FF2D95] transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-[#007BA7] bg-clip-text text-transparent">
                EquiLens
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#FF2D95]/10 text-[#FF2D95] border border-[#FF2D95]/30">
                v1.0 LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wider">
              AI BIAS & CANDIDATE PROTECTION PLATFORM
            </p>
          </div>
        </Link>
      </div>

      {/* Center Status / Mission Callout */}
      <div className="hidden lg:flex items-center space-x-3 bg-[#121217] px-4 py-1.5 rounded-full border border-[#22222E]">
        <div className={`w-2.5 h-2.5 rounded-full ${isBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-xs font-mono text-slate-300">
          CENTRAL MISSION: <span className="text-[#007BA7] font-semibold">AI BIAS MITIGATION</span> &amp; RESPONSIBLE FAIRNESS
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Executive Fairness Indicator */}
        <Link
          to="/fairness-scorecard"
          className="flex items-center space-x-2 bg-[#121217] hover:bg-[#181822] border border-[#007BA7]/30 hover:border-[#007BA7] px-3.5 py-1.5 rounded-lg transition-all"
        >
          <Cpu className="w-4 h-4 text-[#007BA7]" />
          <div className="text-left">
            <div className="text-[10px] text-slate-400 font-mono uppercase leading-tight">Fairness Health</div>
            <div className="text-sm font-bold font-mono text-[#007BA7] leading-tight">
              {fairnessScore} <span className="text-[10px] text-slate-500">/ 100</span>
            </div>
          </div>
        </Link>

        {/* Hackathon Demo Quick Launch Button */}
        <Link
          to="/scam-shield"
          className="relative inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF2D95] to-[#C81B70] text-white text-xs font-bold font-mono tracking-wide shadow-rose-glow hover:opacity-95 transition-all transform active:scale-95"
        >
          <Zap className="w-4 h-4 animate-bounce" />
          <span>HACKATHON DEMO</span>
        </Link>
      </div>
    </header>
  );
};
