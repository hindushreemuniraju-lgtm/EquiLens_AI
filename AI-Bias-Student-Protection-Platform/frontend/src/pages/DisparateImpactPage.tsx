import React, { useState, useEffect } from 'react';
import { Scale, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { FairnessScorecardData, DatasetItem } from '../types';

export const DisparateImpactPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([{ id: "DATASET-SAMPLE-01", name: "Recruitment Fairness Audit Baseline (1,200 Applicants)" } as DatasetItem]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("DATASET-SAMPLE-01");
  const [protectedAttr, setProtectedAttr] = useState<string>("gender");
  const [scorecard, setScorecard] = useState<FairnessScorecardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    runAudit("DATASET-SAMPLE-01", "gender");
    api.getDatasets()
      .then(list => {
        if (list && list.length > 0) setDatasets(list);
      })
      .catch(console.error);
  }, []);

  const runAudit = async (datasetId?: string, attr?: string) => {
    const dId = datasetId || selectedDatasetId || "DATASET-SAMPLE-01";
    const a = attr || protectedAttr;

    setLoading(true);
    try {
      const res = await api.runFairnessAudit({
        dataset_id: dId,
        protected_attribute: a
      });
      setScorecard(res);
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
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/30">
            PILLAR 2: LEGAL AUDIT
          </span>
          <span className="text-xs text-slate-400 font-mono">EEOC Four-Fifths (80%) Regulatory Rule</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">The 80% Disparate Impact Audit</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Under the US Equal Employment Opportunity Commission (EEOC) Uniform Guidelines and global algorithmic compliance standards, a selection rate for any protected group that is less than <strong>80% (four-fifths)</strong> of the rate for the highest group is regarded as evidence of adverse impact.
        </p>
      </div>

      {/* Control Selector */}
      <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-card-dark">
        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Target Dataset</label>
          <select
            value={selectedDatasetId}
            onChange={(e) => {
              setSelectedDatasetId(e.target.value);
              runAudit(e.target.value, protectedAttr);
            }}
            className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7]"
          >
            {datasets.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Audited Protected Attribute</label>
          <select
            value={protectedAttr}
            onChange={(e) => {
              setProtectedAttr(e.target.value);
              runAudit(selectedDatasetId, e.target.value);
            }}
            className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7]"
          >
            <option value="gender">Gender</option>
            <option value="caste_category">Caste Category</option>
            <option value="age_group">Age Group</option>
          </select>
        </div>
      </div>

      {scorecard && (
        <div className="space-y-6">
          {/* Main Ratio Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Object.entries(scorecard.pairwise_metrics.disparate_impact_ratios).map(([group, ratio]) => {
              const isRef = group === scorecard.reference_group;
              const isAdverse = scorecard.pairwise_metrics.adverse_impact_flags[group];
              const selRate = scorecard.group_stats[group]?.selection_rate ?? 0;

              return (
                <div
                  key={group}
                  className={`bg-[#121217] border rounded-xl p-5 shadow-card-dark space-y-4 ${
                    isRef
                      ? "border-[#007BA7]/60"
                      : isAdverse
                      ? "border-[#FF2D95] shadow-rose-glow"
                      : "border-emerald-500/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-white">{group}</span>
                    {isRef ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/20 text-[#007BA7]">
                        BENCHMARK REF
                      </span>
                    ) : isAdverse ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/40 animate-pulse">
                        ADVERSE IMPACT (&lt;80%)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400">
                        COMPLIANT (&ge;80%)
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Impact Ratio vs Reference</div>
                    <div className={`text-3xl font-extrabold font-mono mt-1 ${isRef ? 'text-white' : isAdverse ? 'text-[#FF2D95]' : 'text-emerald-400'}`}>
                      {(ratio * 100).toFixed(1)}%
                      <span className="text-xs text-slate-500 font-normal"> ({ratio.toFixed(3)})</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1E1E2A] text-xs font-mono text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Group Selection Rate:</span>
                      <strong className="text-white">{(selRate * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reference Selection Rate:</span>
                      <strong className="text-white">
                        {(scorecard.group_stats[scorecard.reference_group]?.selection_rate * 100).toFixed(1)}%
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legal Guidance Context */}
          <div className="bg-[#121217] border border-[#22222E] rounded-xl p-6 shadow-card-dark space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#007BA7]" />
              <span>Legal Interpretation &amp; Compliance Context</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              The 80% rule is a widely adopted threshold for screening employment practices. Where a selection rate falls below 0.80, the burden shifts to the employer to demonstrate that the selection criteria are strictly job-related and consistent with business necessity, with no viable alternative practice having less adverse impact.
            </p>
            <div className="pt-2 text-[11px] font-mono text-amber-400">
              * Important limitation: The 80% rule is an empirical screening heuristic, not a standalone conclusive legal determination of discrimination.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
