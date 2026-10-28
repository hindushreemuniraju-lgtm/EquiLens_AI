import React, { useState, useEffect } from 'react';
import { Binary, ArrowUpRight, ArrowDownRight, Award, ShieldCheck, RefreshCw, BarChart2, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { ShapExplanationResult } from '../types';

export const ExplainabilityPage: React.FC = () => {
  const [candidateId, setCandidateId] = useState<string>("CAND-10023");
  const [result, setResult] = useState<ShapExplanationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchExplanation = async (id?: string) => {
    const cId = id || candidateId;
    setLoading(true);
    try {
      const res = await api.explainCandidate({
        candidate_id: cId,
        candidate_name: "Anand Sharma"
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation("CAND-10023");
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-[#22222E]">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
            PILLAR 3: EXPLAINABLE AI
          </span>
          <span className="text-xs text-slate-400 font-mono">Mathematical SHAP Factor Attribution</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">SHAP Credential Attribution</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Extracts the exact mathematical weight of individual credentials (coding scores, system design, certifications, verified experience) driving model predictions. Replaces opaque rejection ghosting with transparent, data-backed reasoning.
        </p>
      </div>

      {/* Candidate Selector */}
      <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-card-dark">
        <div className="flex items-center space-x-3">
          <label className="text-xs font-mono text-slate-400 uppercase">Select Candidate:</label>
          <select
            value={candidateId}
            onChange={(e) => {
              setCandidateId(e.target.value);
              fetchExplanation(e.target.value);
            }}
            className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7]"
          >
            <option value="CAND-10023">CAND-10023 (Anand Sharma - Rejection Audit)</option>
            <option value="CAND-10045">CAND-10045 (Priya Nair - Borderline Score)</option>
            <option value="CAND-10012">CAND-10012 (Rahul Verma - Selected Candidate)</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Demographic Attributes Isolated from Features</span>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Candidate Decision Overview Banner */}
          <div className="bg-[#121217] border border-[#22222E] rounded-2xl p-6 shadow-card-dark grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Candidate Evaluation</span>
              <div className="text-2xl font-extrabold font-mono text-white">
                {candidateId}
              </div>
              <div className="text-xs font-mono text-slate-400">
                Predicted Probability: <strong className="text-white">{(result.explanation.prediction_probability * 100).toFixed(1)}%</strong>
              </div>
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Model Decision</span>
              <div className={`text-2xl font-extrabold font-mono ${
                result.explanation.prediction === 1 ? 'text-emerald-400' : 'text-[#FF2D95]'
              }`}>
                {result.explanation.prediction === 1 ? 'RECOMMENDED FOR HIRE' : 'APPLICATION REJECTED'}
              </div>
              <span className="text-[10px] font-mono text-slate-500">Threshold: 50.0%</span>
            </div>

            <div className="p-3 bg-[#0A0A0A] rounded-xl border border-[#1E1E2A] text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Model Expected Value:</span>
                <span className="text-white">{result.explanation.base_value.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SHAP Attributed Sum:</span>
                <span className="text-white">{result.explanation.explained_sum.toFixed(3)}</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-[#1E1E2A]">
                Formula: Output = Base + Σ(SHAP Features)
              </div>
            </div>
          </div>

          {/* Positive vs Negative Contributors Waterfall */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Positive Drivers */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#22222E]">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Positive Credential Contributors ({result.explanation.positive_factors.length})
                </h3>
              </div>

              <div className="space-y-3">
                {result.explanation.positive_factors.map((f, i) => (
                  <div key={i} className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A] space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white font-bold">{f.feature}</span>
                      <span className="text-emerald-400 font-bold">+{f.shap_value.toFixed(4)}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Applicant Value: <strong className="text-slate-200">{f.feature_value}</strong>
                    </div>
                    <div className="w-full bg-[#181822] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${Math.min(100, Math.abs(f.shap_value) * 300)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Negative Drivers (Skill Gaps) */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#22222E]">
                <ArrowDownRight className="w-4 h-4 text-[#FF2D95]" />
                <h3 className="text-xs font-mono font-bold text-[#FF2D95] uppercase tracking-wider">
                  Negative Deficiencies / Skill Gaps ({result.explanation.negative_factors.length})
                </h3>
              </div>

              <div className="space-y-3">
                {result.explanation.negative_factors.map((f, i) => (
                  <div key={i} className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A] space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white font-bold">{f.feature}</span>
                      <span className="text-[#FF2D95] font-bold">{f.shap_value.toFixed(4)}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Applicant Value: <strong className="text-slate-200">{f.feature_value}</strong>
                    </div>
                    <div className="w-full bg-[#181822] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-[#FF2D95] rounded-full"
                        style={{ width: `${Math.min(100, Math.abs(f.shap_value) * 300)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Global Feature Importance */}
          <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Global Feature Importance Across Entire Cohort (Mean |SHAP|)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.global_importance.map((imp, idx) => (
                <div key={idx} className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                  <div className="text-xs font-bold font-mono text-white truncate">{imp.feature}</div>
                  <div className="text-lg font-mono font-bold text-[#007BA7] mt-1">
                    {imp.importance_percentage}%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    Mean |SHAP|: {imp.importance_score.toFixed(3)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
