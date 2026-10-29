import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Lock,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mail,
  Fingerprint,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { ScamDemonstrationResult } from '../types';
import { LiveTypewriterRedactor } from '../components/LiveTypewriterRedactor';

const DEMO_SAMPLE_MESSAGE = "Pay ₹2500 training fee to HR Ramesh at 98450-XXXXX for Google Bangalore offer letter.";

export const ScamShieldDemoPage: React.FC = () => {
  const [inputMessage, setInputMessage] = useState<string>(DEMO_SAMPLE_MESSAGE);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    handleRunDemo(DEMO_SAMPLE_MESSAGE);
  }, []);
  const [result, setResult] = useState<ScamDemonstrationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedFingerprint, setCopiedFingerprint] = useState<boolean>(false);
  const [copiedSafeReply, setCopiedSafeReply] = useState<boolean>(false);
  const [copiedComplaint, setCopiedComplaint] = useState<boolean>(false);

  const handleRunDemo = async (msg?: string) => {
    const text = msg || inputMessage;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await api.analyzeScam(text);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#22222E]">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/40 animate-pulse">
            CRITICAL HACKATHON DEMO (PILLAR 5 &amp; 6)
          </span>
          <span className="text-xs text-slate-400 font-mono">End-to-End 10-Step Student Protection Pipeline</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">Student Scam Shield &amp; Anti-Phishing Defense</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Full execution of the exact 10-step student defense sequence specified in the product blueprint. Transforms raw predatory recruitment communications into privacy-preserving hashes, detects fraud indicators, generates safe replies, and formats cybercrime drafts.
        </p>
      </div>

      {/* Step 1: Input Box */}
      <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-[#007BA7] text-white flex items-center justify-center text-xs font-mono font-bold">1</span>
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Step 1: Input Recruitment Communication
            </label>
          </div>
          <button
            onClick={() => {
              setInputMessage(DEMO_SAMPLE_MESSAGE);
              handleRunDemo(DEMO_SAMPLE_MESSAGE);
            }}
            className="text-xs font-mono text-[#FF2D95] hover:underline"
          >
            Reset to Official Blueprint Sample
          </button>
        </div>

        <textarea
          rows={3}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Paste recruitment SMS, WhatsApp message, or email text..."
          className="w-full bg-[#0A0A0A] border border-[#22222E] rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#FF2D95] leading-relaxed resize-y"
        />

        <div className="flex justify-end">
          <button
            onClick={() => handleRunDemo()}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2D95] to-[#C81B70] text-white text-xs font-mono font-bold tracking-wider shadow-rose-glow flex items-center gap-2 hover:opacity-95 transition-all transform active:scale-95"
          >
            <Zap className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? "EXECUTING PIPELINE..." : "ANALYZE MESSAGE & EXECUTE DEFENSE"}</span>
          </button>
        </div>
      </div>

      {/* Steps 2 to 10 Execution Results */}
      {result && (
        <div className="space-y-6">
          {/* Step 2 & 6: Risk Assessment & Indicators */}
          <div className="bg-[#121217] border border-[#FF2D95]/40 rounded-xl p-6 shadow-card-dark space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#FF2D95] text-white flex items-center justify-center text-xs font-mono font-bold">2</span>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Step 2 &amp; 6: NLP Threat Detection &amp; Risk Assessment
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/40 animate-pulse">
                THREAT LEVEL: {result.step_2_analysis.threat_level} ({result.step_2_analysis.risk_score}/100)
              </span>
            </div>

            <div className="text-xs text-slate-200 bg-[#0A0A0A] p-4 rounded-xl border border-[#1E1E2A]">
              <strong>Verdict:</strong> {result.step_2_analysis.verdict}
            </div>

            {/* Evidence Findings */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Detected Evidence Indicators ({result.step_2_analysis.findings.length}):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.step_2_analysis.findings.map((finding, idx) => (
                  <div key={idx} className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A] space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-white">{finding.name}</span>
                      <span className="text-[#FF2D95] text-[10px]">{finding.category}</span>
                    </div>
                    <div className="text-xs font-mono text-amber-300">
                      Matched: "{finding.matched_text}"
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-1">
                      {finding.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: PII Redaction Live Display */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#007BA7] text-white flex items-center justify-center text-xs font-mono font-bold">3</span>
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Step 3: Cryptographic PII Masking &amp; Tokenization
              </span>
            </div>
            <LiveTypewriterRedactor
              originalText={result.step_3_redaction.original_text}
              redactedText={result.step_3_redaction.redacted_text}
              redactions={result.step_3_redaction.redactions}
            />
          </div>

          {/* Step 4: SHA-256 Threat Fingerprint */}
          <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#22222E]">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#007BA7] text-white flex items-center justify-center text-xs font-mono font-bold">4</span>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-[#007BA7]" />
                  Step 4: SHA-256 Threat Fingerprint Generation
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(result.step_4_fingerprint.sha256_fingerprint, setCopiedFingerprint)}
                className="px-3 py-1 rounded bg-[#181824] hover:bg-[#222232] text-xs font-mono text-slate-300 border border-[#282838] flex items-center gap-1.5 transition-colors"
              >
                {copiedFingerprint ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFingerprint ? "Copied!" : "Copy SHA-256"}</span>
              </button>
            </div>

            <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A] text-xs font-mono text-[#007BA7] break-all select-all font-bold">
              {result.step_4_fingerprint.sha256_fingerprint}
            </div>

            <div className="text-xs text-slate-400 font-sans leading-relaxed">
              <strong>Normalized Structural Pattern:</strong> <code className="text-slate-300 bg-[#0A0A0A] px-2 py-0.5 rounded">{result.step_4_fingerprint.normalized_pattern}</code>
              <p className="mt-1 text-[11px] text-slate-500">
                {result.step_4_fingerprint.explanation}
              </p>
            </div>
          </div>

          {/* Step 5: Community Registry Check */}
          <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#22222E]">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#007BA7] text-white flex items-center justify-center text-xs font-mono font-bold">5</span>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Step 5: Crowdsourced Community Shield Registry
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                result.step_5_community_registry.matched
                  ? "bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/40"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              }`}>
                {result.step_5_community_registry.matched ? "EXACT REGISTRY MATCH FOUND" : "NEW THREAT SIGNATURE RECORDED"}
              </span>
            </div>

            {result.step_5_community_registry.matched ? (
              <div className="p-4 bg-[#FF2D95]/5 border border-[#FF2D95]/20 rounded-xl space-y-2 text-xs font-mono">
                <div className="text-white font-bold">
                  Matched Signature ID: {result.step_5_community_registry.report_id}
                </div>
                <div className="text-slate-300">
                  Targeted Organization: <strong className="text-white">{result.step_5_community_registry.claimed_company}</strong>
                </div>
                <div className="text-amber-400">
                  Total Students Affected / Reports Received: <strong>{result.step_5_community_registry.reported_count}</strong>
                </div>
                <div className="text-slate-500 text-[10px]">
                  First Detected: {result.step_5_community_registry.first_reported}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A] text-xs font-mono text-slate-300">
                {result.step_5_community_registry.note}
              </div>
            )}
          </div>

          {/* Step 7: Safe Reply Generator */}
          <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#007BA7] text-white flex items-center justify-center text-xs font-mono font-bold">7</span>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#007BA7]" />
                  Step 7: Safe Reply Assistant (Verification Response)
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(result.step_7_safe_reply.templates[0].text, setCopiedSafeReply)}
                className="px-3 py-1 rounded bg-[#181824] hover:bg-[#222232] text-xs font-mono text-slate-300 border border-[#282838] flex items-center gap-1.5 transition-colors"
              >
                {copiedSafeReply ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSafeReply ? "Copied Response!" : "Copy Safe Reply"}</span>
              </button>
            </div>

            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1E1E2A] text-xs font-mono text-slate-200 whitespace-pre-line leading-relaxed">
              {result.step_7_safe_reply.templates[0].text}
            </div>

            {/* Security Reminders */}
            <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A] space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                Student Defense Reminders:
              </span>
              <ul className="text-xs text-slate-400 list-disc list-inside space-y-0.5 font-sans">
                {result.step_7_safe_reply.security_reminders.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 8: 1-Click Cybercrime Report Draft */}
          <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#007BA7] text-white flex items-center justify-center text-xs font-mono font-bold">8</span>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#007BA7]" />
                  Step 8: 1-Click Cybercrime Incident Draft (cybercrime.gov.in)
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(result.step_8_cybercrime_draft.formatted_draft, setCopiedComplaint)}
                className="px-3 py-1 rounded bg-[#181824] hover:bg-[#222232] text-xs font-mono text-slate-300 border border-[#282838] flex items-center gap-1.5 transition-colors"
              >
                {copiedComplaint ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedComplaint ? "Copied Draft!" : "Copy Complaint Text"}</span>
              </button>
            </div>

            <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A] text-[11px] font-mono text-slate-400 space-y-1">
              <div>Filing Destination: <strong className="text-white">{result.step_8_cybercrime_draft.filing_portal}</strong></div>
              <div>Statutory Grounds: <span className="text-amber-400">{result.step_8_cybercrime_draft.applicable_laws.join(" • ")}</span></div>
            </div>

            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1E1E2A] text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto scrollbar-thin">
              {result.step_8_cybercrime_draft.formatted_draft}
            </div>

            <p className="text-[10px] text-slate-500 font-mono">
              * {result.step_8_cybercrime_draft.legal_notice}
            </p>
          </div>

          {/* Step 9 & 10: Audit Log & Complete Summary */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-[#121217] to-emerald-500/10 border border-emerald-500/30 shadow-card-dark flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  Steps 9 &amp; 10: Audit Trail &amp; Verification Complete
                </span>
                <h4 className="text-sm font-bold font-mono text-white mt-0.5">
                  {result.step_10_completion_summary.message}
                </h4>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Non-sensitive immutable event logged to SQLite database audit trail.
                </div>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              10/10 STEPS VERIFIED
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
