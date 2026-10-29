import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Trash2, CheckCircle2, AlertTriangle, FileKey, RefreshCw, Languages } from 'lucide-react';
import { api } from '../services/api';

export const PrivacyCenterPage: React.FC = () => {
    const [purposes, setPurposes] = useState<any[]>([]);
    const [notices, setNotices] = useState<Record<string, string>>({});
    const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
    const [consents, setConsents] = useState<Record<string, boolean>>({
        RESUME_SKILL_EVALUATION: true,
        ISOLATED_FAIRNESS_AUDIT: true,
        SCAM_THREAT_FINGERPRINT: true,
        MODEL_RETRAINING_OPT_OUT: true
    });
    const [targetCandidateId, setTargetCandidateId] = useState<string>("CAND-10023");
    const [erasureResult, setErasureResult] = useState<any>(null);
    const [retentionStatus, setRetentionStatus] = useState<any>(null);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    useEffect(() => {
        api.getConsentPurposes()
            .then(data => {
                setPurposes(data.purposes);
                setNotices(data.regional_notices);
            })
            .catch(console.error);

        api.getRetentionStatus()
            .then(setRetentionStatus)
            .catch(console.error);
    }, []);

    const handleToggleConsent = (purposeId: string) => {
        const updated = { ...consents, [purposeId]: !consents[purposeId] };
        setConsents(updated);
        api.submitConsent("STUDENT-DEMO-USER", updated, selectedLanguage)
            .then(res => {
                setStatusMsg(`Updated consent settings recorded in audit ledger at ${new Date(res.timestamp).toLocaleTimeString()}`);
                setTimeout(() => setStatusMsg(null), 3000);
            })
            .catch(console.error);
    };

    const handleErasure = async () => {
        if (!targetCandidateId.trim()) return;
        try {
            const res = await api.executeErasure(targetCandidateId, "Candidate DPDP Section 12 Right to be Forgotten Request");
            setErasureResult(res);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            {/* Header */}
            <div className="pb-4 border-b border-[#22222E]">
                <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
                        PILLAR 6: PRIVACY BY DESIGN
                    </span>
                    <span className="text-xs text-slate-400 font-mono">India DPDP Act (2023) &amp; GDPR Framework</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white mt-1">Privacy, Granular Consent &amp; DPDP Vault</h1>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    Full implementation of Purpose Limitation, Granular Consent, Protected Demographic Isolation, and 1-Click Right to Erasure (Right to be Forgotten) under India's Digital Personal Data Protection Act, 2023.
                </p>
            </div>

            {statusMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{statusMsg}</span>
                </div>
            )}

            {/* Regional Privacy Notice Selector */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#22222E]">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                        <Languages className="w-4 h-4 text-[#007BA7]" />
                        <span>Statutory Regional Privacy Explanation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {["en", "hi", "kn", "ta"].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setSelectedLanguage(lang)}
                                className={`px-2.5 py-0.5 rounded text-xs font-mono uppercase font-bold transition-all ${
                                    selectedLanguage === lang
                                        ? "bg-[#007BA7] text-white shadow-cerulean-glow"
                                        : "bg-[#0A0A0A] text-slate-400 border border-[#262636]"
                                }`}
                            >
                                {lang === "en" ? "English" : lang === "hi" ? "हिंदी" : lang === "kn" ? "ಕನ್ನಡ" : "தமிழ்"}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-xs font-sans text-slate-300 leading-relaxed bg-[#0A0A0A] p-3.5 rounded-lg border border-[#1E1E2A]">
                    {notices?.[selectedLanguage] || notices?.["en"] || "EquiLens processes personal data under strict purpose limitation principles. Your demographic information is stored in an isolated vault and never enters recruitment prediction features."}
                </p>
            </div>

            {/* Granular Purpose Consent Toggles */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-6 shadow-card-dark space-y-4">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Granular Purpose-Specific Consent Engine
                </h3>

                <div className="space-y-3">
                    {purposes.map((p) => {
                        const isGranted = consents[p.id] ?? false;
                        return (
                            <div
                                key={p.id}
                                className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1E1E2A] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                                <div className="space-y-1">
                                    <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                                        <span>{p.title}</span>
                                        {p.is_mandatory_for_evaluation && (
                                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                                MANDATORY FOR EVALUATION
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                                        {p.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleToggleConsent(p.id)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                                        isGranted
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                            : "bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/40"
                                    }`}
                                >
                                    {isGranted ? "CONSENT GRANTED" : "REVOKED / WITHDRAWN"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 1-Click DPDP Right to Erasure Workflow */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-6 shadow-card-dark space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-[#22222E]">
                    <Trash2 className="w-4 h-4 text-[#FF2D95]" />
                    <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                        1-Click Right to Erasure (DPDP Act 2023 Sec 12 / GDPR Art 17)
                    </h3>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Executes irreversible deletion of student evaluations, interview recordings, and consent records from primary operational databases. Issues a cryptographic certificate of erasure.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                        type="text"
                        value={targetCandidateId}
                        onChange={(e) => setTargetCandidateId(e.target.value)}
                        placeholder="Enter Candidate ID (e.g. CAND-10023)..."
                        className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#FF2D95] w-full sm:w-80"
                    />
                    <button
                        onClick={handleErasure}
                        className="px-5 py-2 rounded-xl bg-[#FF2D95] hover:bg-[#FF45A3] text-white text-xs font-mono font-bold tracking-wider shadow-rose-glow flex items-center gap-2 transition-all shrink-0"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>PURGE RECORDS &amp; ISSUE CERTIFICATE</span>
                    </button>
                </div>

                {erasureResult && (
                    <div className="p-4 rounded-xl bg-[#0A0A0A] border border-emerald-500/40 space-y-3 font-mono text-xs">
                        <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>IRREVERSIBLE ERASURE COMPLETED</span>
                        </div>
                        <div className="text-slate-300">
                            Erasure Certificate ID: <strong className="text-white">{erasureResult.erasure_certificate_id}</strong>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                            Candidate Hash: {erasureResult.details.target_identifier_hash}
                        </div>
                        <div className="text-slate-500 text-[10px]">
                            {erasureResult.details.backup_limitation_notice}
                        </div>
                    </div>
                )}
            </div>

            {/* Retention Policies */}
            {retentionStatus && (
                <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-3">
                    <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                        Active Automated Data Minimization &amp; Retention Policy
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                        {(retentionStatus?.retention_rules || []).map((rule: any, i: number) => (
                            <div key={i} className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A] space-y-1">
                                <div className="text-white font-bold truncate">{rule.data_category}</div>
                                <div className="text-[#007BA7]">Max: {rule.max_retention_days} Days</div>
                                <div className="text-[10px] text-slate-500">
                                    Auto-Purge: {rule.auto_purge ? "ENABLED" : "IMMUTABLE AUDIT"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
