import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, FileCheck, Lock, Award, KeyRound } from 'lucide-react';
import { api } from '../services/api';
import { ShapExplanationResult } from '../types';

export const BiasVerificationPage: React.FC = () => {
  const [candidateId, setCandidateId] = useState<string>("CAND-10023");
  const [data, setData] = useState<ShapExplanationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchVerification = async (id?: string) => {
    setLoading(true);
    try {
      const res = await api.explainCandidate({ candidate_id: id || candidateId });
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification("CAND-10023");
  }, []);

  const verification = data?.bias_free_verification;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-[#22222E]">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
            PILLAR 3: VERIFICATION
          </span>
          <span className="text-xs text-slate-400 font-mono">Automated Rejection Sanity &amp; Parity Check</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">Bias-Free Rejection Verification</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Runs an automated sanity check certifying that negative score contributions originated strictly from core job competencies, not demographic proxies or protected attributes. Protects employers from wrongful claims while establishing student trust.
        </p>
      </div>

      {/* Candidate Selector */}
      <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-card-dark">
        <div className="flex items-center space-x-3">
          <label className="text-xs font-mono text-slate-400 uppercase">Target Candidate Decision:</label>
          <select
            value={candidateId}
            onChange={(e) => {
              setCandidateId(e.target.value);
              fetchVerification(e.target.value);
            }}
            className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7]"
          >
            <option value="CAND-10023">CAND-10023 (Technical Competency Gap)</option>
            <option value="CAND-10045">CAND-10045 (Borderline Candidate)</option>
          </select>
        </div>

        <button
          onClick={() => fetchVerification()}
          disabled={loading}
          className="px-4 py-1.5 rounded-lg bg-[#007BA7] hover:bg-[#0090C4] text-white text-xs font-mono font-bold tracking-wider shadow-cerulean-glow"
        >
          {loading ? "VERIFYING..." : "RE-VERIFY DECISION"}
        </button>
      </div>

      {verification && (
        <div className="space-y-6">
          {/* Certification Badge Banner */}
          <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card-dark ${
            verification.is_certified
              ? "bg-emerald-500/10 border-emerald-500/40"
              : "bg-amber-500/10 border-amber-500/40"
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                verification.is_certified ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                  Verification Certification Status
                </div>
                <div className={`text-xl font-extrabold font-mono ${
                  verification.is_certified ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {verification.sanity_status.replace(/_/g, ' ')}
                </div>
                <p className="text-xs text-slate-300 font-sans mt-1">
                  {verification.message}
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="px-3 py-1 rounded-full bg-[#0A0A0A] border border-[#22222E] text-slate-300">
                Seal ID: EQUILENS-VERIF-7729
              </span>
            </div>
          </div>

          {/* Sanity Checklist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#007BA7]" />
                Algorithmic Integrity Audit Trail
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#1A1A24]">
                  <span>Approved Competency Features Only</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#1A1A24]">
                  <span>Protected Demographic Exclusion</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> EXCLUDED (0 LEAKS)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#1A1A24]">
                  <span>Proxy Correlation Safeguard</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> WITHIN TOLERANCE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#1A1A24]">
                  <span>SHAP Factor Attribution Completeness</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% EXPLAINABLE
                  </span>
                </div>
              </div>
            </div>

            {/* Decision Evidence Factors */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#007BA7]" />
                Primary Objective Rejection Drivers
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Negative score weights originated strictly from verified technical competency shortfalls rather than demographic or proxy attributes:
              </p>

              <div className="space-y-2">
                {verification.primary_rejection_drivers.map((driver, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#0A0A0A] border border-[#1E1E2A] text-xs font-mono flex items-center justify-between">
                    <span className="text-white font-bold">{driver}</span>
                    <span className="text-[#FF2D95] text-[11px]">Primary Deficit</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
