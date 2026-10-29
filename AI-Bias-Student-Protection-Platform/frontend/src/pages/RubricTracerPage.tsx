import React, { useState, useEffect } from 'react';
import { FileSearch, Sparkles, Check, Copy, AlertTriangle, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { api } from '../services/api';
import { RubricTraceResult } from '../types';

export const RubricTracerPage: React.FC = () => {
  const [jobText, setJobText] = useState<string>("Senior Software Engineer. Premier institutes only (IIT/BITS/NIT). Native-level English required. Must relocate immediately to Bengaluru within 7 days. Continuous employment only with zero gap years.");
  const [samples, setSamples] = useState<any[]>([
    { id: "SAMPLE-01", title: "Premier Institutes & Urgent Relocation", text: "Senior Software Engineer. Premier institutes only (IIT/BITS/NIT). Native-level English required. Must relocate immediately to Bengaluru within 7 days. Continuous employment only with zero gap years." }
  ]);
  const [result, setResult] = useState<RubricTraceResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    api.getSampleRubrics()
      .then(data => {
        setSamples(data);
        if (data.length > 0) {
          setJobText(data[0].text);
          handleAudit(data[0].text);
        }
      })
      .catch(console.error);
  }, []);

  const handleAudit = async (textToAudit?: string) => {
    const text = textToAudit ?? jobText;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await api.traceRubric(text);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyRevised = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.revised_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-[#22222E]">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
            PILLAR 1: PUBLIC RUBRICS
          </span>
          <span className="text-xs text-slate-400 font-mono">Linguistic Bias &amp; Exclusion Tracer</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">Biased Rubric &amp; Job Description Tracer</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Scans public job postings, screening rubrics, and evaluation instructions for covert gatekeeping phrases (e.g., "Premier institutes only", "Native-level English", "Must relocate immediately", "rockstar/ninja"). Generates an inclusive revised variant.
        </p>
      </div>

      {/* Preset Sample Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[#007BA7]" />
          Load Benchmark Sample:
        </span>
        {samples.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setJobText(s.text);
              handleAudit(s.text);
            }}
            className="px-3 py-1 rounded-lg bg-[#121217] hover:bg-[#1C1C28] border border-[#22222E] hover:border-[#007BA7] text-xs font-mono text-slate-300 transition-colors"
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Input Text Area */}
      <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark">
        <div className="flex items-center justify-between pb-3 border-b border-[#22222E] mb-3">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Job Description / Evaluation Rubric Text
          </label>
          <button
            onClick={() => handleAudit()}
            disabled={loading}
            className="px-4 py-1.5 rounded-lg bg-[#007BA7] hover:bg-[#0090C4] text-white text-xs font-mono font-bold tracking-wider shadow-cerulean-glow flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? "AUDITING..." : "AUDIT RUBRIC FOR BIAS"}</span>
          </button>
        </div>

        <textarea
          rows={7}
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste screening rubric or job description here..."
          className="w-full bg-[#0A0A0A] border border-[#22222E] rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7] transition-colors resize-y"
        />
      </div>

      {/* Audit Findings */}
      {result && (
        <div className="space-y-6">
          {/* Inclusivity Index Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Inclusivity Score</div>
                <div className={`text-2xl font-bold font-mono mt-1 ${result.inclusivity_index >= 70 ? 'text-emerald-400' : 'text-[#FF2D95]'}`}>
                  {result.inclusivity_index} / 100
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${result.inclusivity_index >= 70 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#FF2D95]/10 text-[#FF2D95]'}`}>
                {result.inclusivity_index >= 70 ? "PASS" : "RISK"}
              </div>
            </div>

            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Exclusionary Phrases Flagged</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {result.total_flagged_count}
              </div>
            </div>

            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Summary Status</div>
              <div className="text-xs font-mono text-slate-300 mt-1 line-clamp-2">
                {result.summary}
              </div>
            </div>
          </div>

          {/* Side-by-Side: Flagged Breakdown & Revised Text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Detailed Flagged Cards */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Flagged Exclusionary Elements ({result.flagged_phrases.length})
              </h3>

              {result.flagged_phrases.map((item, idx) => (
                <div key={idx} className="bg-[#121217] border border-[#22222E] rounded-xl p-4 space-y-3 shadow-card-dark">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/30">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Confidence: {(item.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-slate-400">Flagged Phrase:</span>
                    <div className="text-xs font-mono font-bold text-[#FF2D95] bg-[#FF2D95]/5 p-2 rounded border border-[#FF2D95]/20 mt-1">
                      "{item.flagged_phrase}"
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <div><strong className="text-white">Concern:</strong> {item.concern}</div>
                    <div><strong className="text-white">Explanation:</strong> {item.explanation}</div>
                    <div>
                      <strong className="text-white">Affected Cohorts:</strong>{" "}
                      <span className="text-amber-300">{item.affected_groups.join(", ")}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1E1E2A]">
                    <span className="text-[11px] font-mono text-[#007BA7] font-semibold">Suggested Alternative:</span>
                    <div className="text-xs font-mono text-emerald-400 bg-emerald-500/5 p-2 rounded border border-emerald-500/20 mt-1">
                      {item.suggested_alternative}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Inclusive Revised Text */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#22222E] mb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Inclusive Revised Job Description
                </span>
                <button
                  onClick={copyRevised}
                  className="px-3 py-1 rounded bg-[#181824] hover:bg-[#222232] text-xs font-mono text-slate-300 border border-[#282838] flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Revised Text"}</span>
                </button>
              </div>

              <textarea
                rows={16}
                value={result.revised_text}
                onChange={(e) => setResult({ ...result, revised_text: e.target.value })}
                className="w-full flex-1 bg-[#0A0A0A] border border-[#22222E] rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50 leading-relaxed resize-y"
              />
              <p className="text-[11px] text-slate-500 font-mono mt-3">
                * Editable. Preserves original role context while replacing gatekeeping biases with competency-verified standards.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
