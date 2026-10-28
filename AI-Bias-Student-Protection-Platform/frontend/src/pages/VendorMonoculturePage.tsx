import React, { useState, useEffect } from 'react';
import { Network, AlertTriangle, Layers, Info, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const VendorMonoculturePage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        api.getVendorMonoculture()
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            {/* Header */}
            <div className="pb-4 border-b border-[#22222E]">
                <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
                        ROADMAP INNOVATION (PHASE 2)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Cross-Pipeline ATS Monoculture Scanner</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white mt-1">Vendor-Monoculture Lockout Detection</h1>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    Investigates whether dominant commercial screening engines (e.g. ScreenAI, TalentFilter) systematically lock out specific student profiles across multiple enterprise recruitment pipelines simultaneously.
                </p>
            </div>

            {/* Synthetic Benchmark Notification */}
            <div className="p-4 rounded-xl bg-[#007BA7]/10 border border-[#007BA7]/30 text-xs font-mono text-slate-200 flex items-start gap-3 shadow-card-dark">
                <Info className="w-5 h-5 text-[#007BA7] shrink-0 mt-0.5" />
                <div>
                    <strong className="text-[#007BA7]">Roadmap Research Demonstration:</strong> Clearly labeled synthetic cross-vendor audit telemetry is utilized to showcase multi-pipeline lockout discovery protocols ahead of external enterprise ATS API integrations.
                </div>
            </div>

            {data && (
                <div className="space-y-6">
                    {/* Index Banner */}
                    <div className="bg-[#121217] border border-[#FF2D95]/40 rounded-2xl p-6 shadow-card-dark grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                                Industry Monoculture Lockout Index
                            </span>
                            <div className="text-4xl font-extrabold font-mono text-[#FF2D95] mt-1">
                                {data.industry_monoculture_risk_score} <span className="text-sm text-slate-500 font-normal">/ 100</span>
                            </div>
                            <span className="text-[11px] font-mono text-[#FF2D95] font-bold mt-2 block">
                                HIGH SYSTEMIC LOCKOUT RISK
                            </span>
                        </div>

                        <div className="md:col-span-2 space-y-2 text-xs font-sans text-slate-300">
                            <strong className="text-white block font-mono">The Monoculture Dilemma:</strong>
                            When multiple enterprise employers deploy the same underlying third-party screening algorithms, an erroneous false-negative bias against non-metro or Tier-3 college profiles creates an insurmountable barrier across the entire industry job market.
                        </div>
                    </div>

                    {/* Vendors Audited */}
                    <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-3">
                        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                            Simulated Commercial ATS Screening Vendors
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                            {data.vendors_audited.map((v: any) => (
                                <div key={v.id} className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A] space-y-1">
                                    <div className="text-white font-bold">{v.name}</div>
                                    <div className="text-[#007BA7]">Market Share: {v.market_share}</div>
                                    <div className="text-[10px] text-slate-500">ID: {v.id}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cohort Lockout Matrix */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                            Cross-Pipeline Cohort Rejection Matrix
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.cohort_lockout_matrix.map((c: any) => {
                                const isCritical = c.risk_classification.includes("CRITICAL");
                                return (
                                    <div
                                        key={c.cohort_id}
                                        className={`bg-[#121217] border rounded-xl p-5 shadow-card-dark space-y-3 ${
                                            isCritical ? "border-[#FF2D95]/40" : "border-[#22222E]"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono font-bold text-white">{c.name}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                                isCritical ? "bg-[#FF2D95]/20 text-[#FF2D95]" : "bg-emerald-500/20 text-emerald-400"
                                            }`}>
                                                {c.risk_classification.replace(/_/g, ' ')}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                                            <div className="p-2.5 bg-[#0A0A0A] rounded border border-[#1E1E2A]">
                                                <span className="text-slate-500 text-[10px] uppercase">Simultaneous Lockout</span>
                                                <div className="text-lg font-bold text-white mt-0.5">
                                                    {(c.multi_pipeline_lockout_rate * 100).toFixed(0)}%
                                                </div>
                                            </div>
                                            <div className="p-2.5 bg-[#0A0A0A] rounded border border-[#1E1E2A]">
                                                <span className="text-slate-500 text-[10px] uppercase">Expected Merit Rejection</span>
                                                <div className="text-lg font-bold text-slate-400 mt-0.5">
                                                    {(c.expected_merit_rejection_rate * 100).toFixed(0)}%
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-xs text-slate-400 font-sans">
                                            <strong className="text-slate-200">Shared Root Cause:</strong> {c.primary_shared_feature}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Policy Recommendations */}
                    <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-3">
                        <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                            Anti-Monoculture Governance Safeguards
                        </h3>
                        <ul className="text-xs text-slate-300 font-sans space-y-2 list-disc list-inside">
                            {data.policy_recommendations.map((rec: string, i: number) => (
                                <li key={i}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};
