import React, { useState } from 'react';
import { FileText, Copy, Check, Download, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

export const CybercrimeReportPage: React.FC = () => {
    const [rawInput, setRawInput] = useState<string>(
        "Pay ₹2500 training fee to HR Ramesh at 98450-XXXXX for Google Bangalore offer letter."
    );
    const [complaint, setComplaint] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const handleGenerate = async () => {
        if (!rawInput.trim()) return;
        setLoading(true);
        try {
            const analysis = await api.analyzeScam(rawInput);
            setComplaint(analysis.step_8_cybercrime_draft);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyDraft = () => {
        if (!complaint) return;
        navigator.clipboard.writeText(complaint.formatted_draft);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="pb-4 border-b border-[#22222E]">
                <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
                        PILLAR 5: FRICTIONLESS REPORTING
                    </span>
                    <span className="text-xs text-slate-400 font-mono">National Cyber Crime Reporting Portal Compliance</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white mt-1">1-Click Cybercrime Report Preparation</h1>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    Automatically extracts suspect mobile numbers, personal UPI handles, phishing domains, and corporate impersonation details. Formats a formal complaint draft mapped to Section 66D of the Information Technology Act, 2000 for submission to <strong>cybercrime.gov.in</strong>.
                </p>
            </div>

            {/* Input Box */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                    Incident Evidence / Scam Message Details
                </label>
                <textarea
                    rows={3}
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Enter scam details or paste communication..."
                    className="w-full bg-[#0A0A0A] border border-[#22222E] rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7] leading-relaxed resize-y"
                />

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#0090C4] text-white text-xs font-mono font-bold tracking-wider shadow-cerulean-glow flex items-center gap-2 transition-all"
                    >
                        <FileText className="w-4 h-4" />
                        <span>{loading ? "EXTRACTING & FORMATTING..." : "GENERATE FORMAL COMPLAINT DRAFT"}</span>
                    </button>
                </div>
            </div>

            {/* Complaint Draft View */}
            {complaint && (
                <div className="space-y-6">
                    {/* Destination & Statutory References */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-2">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Filing Authority</span>
                            <div className="text-sm font-bold font-mono text-white flex items-center justify-between">
                                <span>{complaint.filing_portal}</span>
                                <a
                                    href="https://cybercrime.gov.in"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-[#007BA7] hover:underline flex items-center gap-1 font-mono"
                                >
                                    <span>Open Portal</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                            <p className="text-xs text-slate-400 font-sans">
                                Draft structured specifically for India's National Cyber Crime Reporting Portal.
                            </p>
                        </div>

                        <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-2">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Applicable Penal Provisions</span>
                            <div className="text-xs font-mono text-amber-400 space-y-1">
                                {complaint.applicable_laws.map((law: string, i: number) => (
                                    <div key={i}>• {law}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Extracted Suspect Identifiers */}
                    <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-3">
                        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                            Extracted Suspect Evidence Checklist
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center font-mono">
                            <div className="p-2.5 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                                <div className="text-[10px] text-slate-500 uppercase">Claimed Entity</div>
                                <div className="text-xs font-bold text-white mt-1 truncate">{complaint.suspect_identifiers.claimed_company}</div>
                            </div>
                            <div className="p-2.5 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                                <div className="text-[10px] text-slate-500 uppercase">Suspect Phone</div>
                                <div className="text-xs font-bold text-[#FF2D95] mt-1 truncate">{complaint.suspect_identifiers.phone_number}</div>
                            </div>
                            <div className="p-2.5 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                                <div className="text-[10px] text-slate-500 uppercase">UPI Handle</div>
                                <div className="text-xs font-bold text-[#FF2D95] mt-1 truncate">{complaint.suspect_identifiers.upi_identifier}</div>
                            </div>
                            <div className="p-2.5 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                                <div className="text-[10px] text-slate-500 uppercase">Demand Amount</div>
                                <div className="text-xs font-bold text-amber-400 mt-1 truncate">{complaint.suspect_identifiers.demanded_amount}</div>
                            </div>
                            <div className="p-2.5 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                                <div className="text-[10px] text-slate-500 uppercase">Recruiter Alias</div>
                                <div className="text-xs font-bold text-slate-300 mt-1 truncate">{complaint.suspect_identifiers.recruiter_alias}</div>
                            </div>
                            <div className="p-2.5 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                                <div className="text-[10px] text-slate-500 uppercase">Phishing Link</div>
                                <div className="text-xs font-bold text-slate-400 mt-1 truncate">{complaint.suspect_identifiers.phishing_url}</div>
                            </div>
                        </div>
                    </div>

                    {/* Formatted Draft */}
                    <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
                            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                                Editable Complaint Transcript (Pre-Filled)
                            </span>
                            <button
                                onClick={copyDraft}
                                className="px-3.5 py-1.5 rounded-lg bg-[#181824] hover:bg-[#222232] text-xs font-mono text-slate-200 border border-[#282838] flex items-center gap-1.5 transition-colors"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copied ? "Copied Draft!" : "Copy Complaint Text"}</span>
                            </button>
                        </div>

                        <textarea
                            rows={16}
                            value={complaint.formatted_draft}
                            onChange={(e) => setComplaint({ ...complaint, formatted_draft: e.target.value })}
                            className="w-full bg-[#0A0A0A] border border-[#22222E] rounded-lg p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7] leading-relaxed resize-y"
                        />

                        <p className="text-[11px] text-slate-500 font-mono">
                            * {complaint.legal_notice}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
