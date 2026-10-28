import React, { useState } from 'react';
import { Share2, Download, Copy, Check, FileText, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const LiveApiAndExportPage: React.FC = () => {
    // Live API State
    const [candidateData, setCandidateData] = useState({
        candidate_id: "CAND-LIVE-4091",
        years_experience: 4.5,
        coding_score: 84.0,
        system_design_score: 76.5,
        interview_score: 80.0,
        certifications_count: 2,
        gpa: 3.65,
        projects_count: 5
    });
    const [evalResult, setEvalResult] = useState<any>(null);
    const [evalLoading, setEvalLoading] = useState<boolean>(false);

    // Export State
    const [exportReport, setExportReport] = useState<string | null>(null);
    const [exportLoading, setExportLoading] = useState<boolean>(false);
    const [copiedReport, setCopiedReport] = useState<boolean>(false);

    const handleStreamCandidate = async () => {
        setEvalLoading(true);
        try {
            const res = await api.liveEvalCandidate(candidateData);
            setEvalResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setEvalLoading(false);
        }
    };

    const handleGenerateExport = async () => {
        setExportLoading(true);
        try {
            const res = await api.exportAuditReport();
            setExportReport(res.markdown_content);
        } catch (err) {
            console.error(err);
        } finally {
            setExportLoading(false);
        }
    };

    const copyMarkdown = () => {
        if (!exportReport) return;
        navigator.clipboard.writeText(exportReport);
        setCopiedReport(true);
        setTimeout(() => setCopiedReport(false), 2000);
    };

    const downloadMarkdown = () => {
        if (!exportReport) return;
        const blob = new Blob([exportReport], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `EquiLens_EU_AI_Act_Audit_Report.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            {/* Header */}
            <div className="pb-4 border-b border-[#22222E]">
                <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
                        INTEGRATION &amp; GOVERNANCE
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Live ATS REST API &amp; Regulatory Audit Export</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white mt-1">Live Evaluation API &amp; Audit Report Export</h1>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    Demonstrates plug-and-play REST endpoint integration for enterprise Applicant Tracking Systems (ATS) and generates 1-click comprehensive regulatory audit reports mapped directly to the <strong>EU AI Act (Annex III)</strong> and <strong>NIST AI RMF 1.0</strong>.
                </p>
            </div>

            {/* SECTION 1: LIVE EVALUATION API */}
            <div className="bg-[#121217] border border-[#22222E] rounded-2xl p-6 shadow-card-dark space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
                    <div className="flex items-center space-x-2">
                        <Share2 className="w-5 h-5 text-[#007BA7]" />
                        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                            Live Evaluation REST API: POST /api/live-eval/candidate
                        </h2>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/20 text-[#007BA7]">
                        PLUG-AND-PLAY READY
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Coding Score (0-100)</label>
                        <input
                            type="number"
                            value={candidateData.coding_score}
                            onChange={(e) => setCandidateData({ ...candidateData, coding_score: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-[#0A0A0A] border border-[#22222E] rounded-lg p-2 text-xs font-mono text-white"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">System Design (0-100)</label>
                        <input
                            type="number"
                            value={candidateData.system_design_score}
                            onChange={(e) => setCandidateData({ ...candidateData, system_design_score: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-[#0A0A0A] border border-[#22222E] rounded-lg p-2 text-xs font-mono text-white"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Tech Interview (0-100)</label>
                        <input
                            type="number"
                            value={candidateData.interview_score}
                            onChange={(e) => setCandidateData({ ...candidateData, interview_score: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-[#0A0A0A] border border-[#22222E] rounded-lg p-2 text-xs font-mono text-white"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">GPA (0-4.0)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={candidateData.gpa}
                            onChange={(e) => setCandidateData({ ...candidateData, gpa: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-[#0A0A0A] border border-[#22222E] rounded-lg p-2 text-xs font-mono text-white"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <span className="text-[11px] font-mono text-emerald-400">
                        * Strictly isolates demographic features; only approved competencies are evaluated.
                    </span>
                    <button
                        onClick={handleStreamCandidate}
                        disabled={evalLoading}
                        className="px-5 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#0090C4] text-white text-xs font-mono font-bold tracking-wider shadow-cerulean-glow flex items-center gap-2 transition-all"
                    >
                        <Send className="w-3.5 h-3.5" />
                        <span>{evalLoading ? "STREAMING EVALUATION..." : "TEST LIVE ATS ENDPOINT"}</span>
                    </button>
                </div>

                {evalResult && (
                    <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#007BA7]/40 space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">API Response Recommendation:</span>
                            <span className={`px-2 py-0.5 rounded font-bold ${
                                evalResult.recommendation === "ACCEPTED"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-[#FF2D95]/20 text-[#FF2D95]"
                            }`}>
                                {evalResult.recommendation} (Score: {(evalResult.composite_merit_score * 100).toFixed(1)}%)
                            </span>
                        </div>
                        <div className="text-slate-400">
                            Bias Audit Exemption Status: <span className="text-emerald-400">{evalResult.bias_audit_status}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                            Evaluated at {evalResult.timestamp}
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 2: ONE-CLICK REGULATORY AUDIT REPORT EXPORT */}
            <div className="bg-[#121217] border border-[#22222E] rounded-2xl p-6 shadow-card-dark space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
                    <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                            One-Click Enterprise Audit Report Export (EU AI Act &amp; NIST AI RMF)
                        </h2>
                    </div>
                    <button
                        onClick={handleGenerateExport}
                        disabled={exportLoading}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold tracking-wider shadow-sm flex items-center gap-2 transition-all"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{exportLoading ? "GENERATING REPORT..." : "GENERATE COMPLIANCE REPORT"}</span>
                    </button>
                </div>

                {exportReport ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-end space-x-3">
                            <button
                                onClick={copyMarkdown}
                                className="px-3.5 py-1.5 rounded-lg bg-[#181824] hover:bg-[#222232] text-xs font-mono text-slate-200 border border-[#282838] flex items-center gap-1.5 transition-colors"
                            >
                                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedReport ? "Copied!" : "Copy Markdown"}</span>
                            </button>
                            <button
                                onClick={downloadMarkdown}
                                className="px-3.5 py-1.5 rounded-lg bg-[#007BA7] hover:bg-[#0090C4] text-xs font-mono text-white flex items-center gap-1.5 transition-colors shadow-cerulean-glow"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download .md Report</span>
                            </button>
                        </div>

                        <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#22222E] text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto scrollbar-thin">
                            {exportReport}
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center bg-[#0A0A0A] rounded-xl border border-[#1E1E2A] text-xs font-mono text-slate-400">
                        Click "Generate Compliance Report" to compile all statistical parity metrics, 80% rule findings, and mitigation verification records into a formal EU AI Act certification document.
                    </div>
                )}
            </div>
        </div>
    );
};
