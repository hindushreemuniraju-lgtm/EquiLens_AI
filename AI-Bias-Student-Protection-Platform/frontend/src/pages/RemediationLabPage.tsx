import React, { useState, useEffect } from 'react';
import { FlaskConical, Play, CheckCircle2, ArrowRight, TrendingUp, Sliders, Layers, RefreshCw, BarChart2 } from 'lucide-react';
import { api } from '../services/api';
import { RemediationResult, DatasetItem } from '../types';

export const RemediationLabPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("");
  const [techniqueStage, setTechniqueStage] = useState<string>("preprocessing");
  const [techniqueType, setTechniqueType] = useState<string>("reweighting");
  const [protectedAttr, setProtectedAttr] = useState<string>("gender");
  const [result, setResult] = useState<RemediationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    api.getDatasets()
      .then(list => {
        setDatasets(list);
        if (list.length > 0) {
          setSelectedDatasetId(list[0].id);
          runExperiment(list[0].id, "preprocessing", "reweighting");
        }
      })
      .catch(console.error);
  }, []);

  const runExperiment = async (dId?: string, stage?: string, type?: string) => {
    const datasetId = dId || selectedDatasetId;
    const st = stage || techniqueStage;
    const ty = type || techniqueType;
    if (!datasetId) return;

    setLoading(true);
    try {
      const res = await api.runRemediation({
        dataset_id: datasetId,
        protected_attribute: protectedAttr,
        technique_stage: st,
        technique_type: ty
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-[#22222E]">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
            PILLAR 4: REMEDIATION LAB (CORE AI)
          </span>
          <span className="text-xs text-slate-400 font-mono">Automated Algorithmic Bias Mitigation</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">Bias Remediation Lab</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Apply state-of-the-art algorithmic mitigation across the three pipeline stages: <strong>Pre-processing</strong> (Sample Reweighting), <strong>In-processing</strong> (Fairness-Constrained Optimization), and <strong>Post-processing</strong> (Calibrated Threshold Reranking). Compare baseline vs remediated metrics side-by-side with Pareto trade-off curves.
        </p>
      </div>

      {/* Stage Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: "preprocessing",
            title: "1. Pre-Processing (Data Layer)",
            technique: "reweighting",
            desc: "Inverse-propensity sample reweighting to neutralize unrepresentative historical training data before model training."
          },
          {
            id: "inprocessing",
            title: "2. In-Processing (Model Layer)",
            technique: "demographic_parity",
            desc: "Fairness-constrained loss optimization (Exponentiated Gradient) penalizing internal representations predicting protected attributes."
          },
          {
            id: "postprocessing",
            title: "3. Post-Processing (Decision Layer)",
            technique: "equalized_odds",
            desc: "Dynamic group-specific threshold calibration and outcome reranking restoring parity without retraining the model."
          }
        ].map((tab) => {
          const isSelected = techniqueStage === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => {
                setTechniqueStage(tab.id);
                setTechniqueType(tab.technique);
                runExperiment(selectedDatasetId, tab.id, tab.technique);
              }}
              className={`p-5 rounded-xl border cursor-pointer transition-all shadow-card-dark ${
                isSelected
                  ? "bg-[#181824] border-[#007BA7] shadow-cerulean-glow"
                  : "bg-[#121217] border-[#22222E] hover:border-slate-600"
              }`}
            >
              <div className="text-[10px] font-mono text-[#007BA7] font-semibold uppercase">Pipeline Stage</div>
              <h3 className="text-sm font-bold font-mono text-white mt-1">{tab.title}</h3>
              <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">{tab.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Run Action Bar */}
      <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-card-dark">
        <div className="flex items-center space-x-4">
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Dataset</label>
            <select
              value={selectedDatasetId}
              onChange={(e) => setSelectedDatasetId(e.target.value)}
              className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7]"
            >
              {datasets.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Protected Cohort</label>
            <select
              value={protectedAttr}
              onChange={(e) => setProtectedAttr(e.target.value)}
              className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7]"
            >
              <option value="gender">Gender</option>
              <option value="caste_category">Caste Category</option>
              <option value="age_group">Age Group</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => runExperiment()}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#0090C4] text-white text-xs font-mono font-bold tracking-wider shadow-cerulean-glow flex items-center gap-2 transition-all"
        >
          <Play className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? "TRAINING & REMEDIATING..." : "EXECUTE REMEDIATION PIPELINE"}</span>
        </button>
      </div>

      {/* Before vs After Comparison */}
      {result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Before vs. After Remediation Performance Comparison
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Experiment ID: {result.experiment_id}
            </span>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Baseline Model */}
            <div className="bg-[#121217] border border-[#FF2D95]/40 rounded-2xl p-6 shadow-card-dark space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
                <div>
                  <span className="text-[10px] font-mono text-[#FF2D95] font-bold uppercase tracking-wider block">
                    Pre-Mitigation Baseline
                  </span>
                  <h4 className="text-base font-bold font-mono text-white mt-0.5">
                    Unconstrained Baseline Model
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/30">
                  {result.baseline.fairness.compliance_status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                  <span className="text-slate-400 text-[10px] uppercase">Model Accuracy</span>
                  <div className="text-xl font-bold text-white mt-1">
                    {(result.baseline.accuracy * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                  <span className="text-slate-400 text-[10px] uppercase">Demographic Parity Ratio</span>
                  <div className="text-xl font-bold text-[#FF2D95] mt-1">
                    {result.baseline.fairness.metrics.demographic_parity_ratio.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                  <span className="text-slate-400 text-[10px] uppercase">Equal Opportunity Diff</span>
                  <div className="text-xl font-bold text-amber-400 mt-1">
                    {result.baseline.fairness.metrics.equal_opportunity_difference.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                  <span className="text-slate-400 text-[10px] uppercase">Fairness Health Index</span>
                  <div className="text-xl font-bold text-slate-300 mt-1">
                    {result.baseline.fairness.metrics.executive_fairness_score.toFixed(1)} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* Remediated Model */}
            <div className="bg-[#121217] border border-emerald-500/60 rounded-2xl p-6 shadow-card-dark space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                    Post-Mitigation Result
                  </span>
                  <h4 className="text-base font-bold font-mono text-white mt-0.5 truncate max-w-xs">
                    {result.technique_name}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {result.remediated.fairness.compliance_status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                  <span className="text-slate-400 text-[10px] uppercase">Model Accuracy</span>
                  <div className="text-xl font-bold text-white mt-1">
                    {(result.remediated.accuracy * 100).toFixed(1)}%
                    <span className="text-[10px] text-slate-400 font-normal ml-1">
                      ({((result.remediated.accuracy - result.baseline.accuracy) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                  <span className="text-slate-400 text-[10px] uppercase">Demographic Parity Ratio</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {result.remediated.fairness.metrics.demographic_parity_ratio.toFixed(3)}
                    <span className="text-[10px] text-emerald-400 font-normal ml-1">
                      (+{((result.remediated.fairness.metrics.demographic_parity_ratio - result.baseline.fairness.metrics.demographic_parity_ratio) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                  <span className="text-slate-400 text-[10px] uppercase">Equal Opportunity Diff</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {result.remediated.fairness.metrics.equal_opportunity_difference.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#1E1E2A]">
                  <span className="text-slate-400 text-[10px] uppercase">Fairness Health Index</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {result.remediated.fairness.metrics.executive_fairness_score.toFixed(1)} / 100
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pareto Trade-off Curve Table */}
          {result.pareto_tradeoff_curve && result.pareto_tradeoff_curve.length > 0 && (
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#22222E]">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#007BA7]" />
                  Pareto Frontier (Fairness vs. Accuracy Trade-Off Spectrum)
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Evaluated across varying regularization constraint bounds (ε)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0A0A0A] text-slate-400 border-b border-[#22222E]">
                    <tr>
                      <th className="p-2.5">Constraint Strength (ε)</th>
                      <th className="p-2.5">Model Accuracy</th>
                      <th className="p-2.5">F1 Score</th>
                      <th className="p-2.5">Demographic Parity Ratio</th>
                      <th className="p-2.5">Equal Opportunity Diff</th>
                      <th className="p-2.5">Fairness Health Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A24]">
                    {result.pareto_tradeoff_curve.map((pt, i) => (
                      <tr key={i} className="hover:bg-[#161622] transition-colors">
                        <td className="p-2.5 text-white font-bold">{pt.epsilon}</td>
                        <td className="p-2.5">{(pt.accuracy * 100).toFixed(1)}%</td>
                        <td className="p-2.5">{pt.f1_score.toFixed(3)}</td>
                        <td className="p-2.5 text-emerald-400 font-bold">{pt.demographic_parity_ratio.toFixed(3)}</td>
                        <td className="p-2.5">{pt.equal_opportunity_difference.toFixed(3)}</td>
                        <td className="p-2.5 text-[#007BA7] font-bold">{pt.executive_fairness_score.toFixed(1)} / 100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
