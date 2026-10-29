import React, { useState, useEffect } from 'react';
import { Scale, BarChart3, Info, AlertTriangle, CheckCircle2, RefreshCw, Cpu, Layers } from 'lucide-react';
import { api } from '../services/api';
import { FairnessScorecardData, DatasetItem } from '../types';
import { FairnessHealthGauge } from '../components/FairnessHealthGauge';

export const FairnessScorecardPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([{ id: "DATASET-SAMPLE-01", name: "Recruitment Fairness Audit Baseline (1,200 Applicants)" } as DatasetItem]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("DATASET-SAMPLE-01");
  const [protectedAttr, setProtectedAttr] = useState<string>("gender");
  const [referenceGroup, setReferenceGroup] = useState<string>("Male");
  const [scorecard, setScorecard] = useState<FairnessScorecardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    api.getDatasets()
      .then(list => {
        setDatasets(list);
        if (list.length > 0) {
          setSelectedDatasetId(list[0].id);
          runAudit(list[0].id, "gender", "Male");
        }
      })
      .catch(console.error);
  }, []);

  const runAudit = async (datasetId?: string, attr?: string, ref?: string) => {
    const dId = datasetId || selectedDatasetId || "DATASET-SAMPLE-01";
    const a = attr || protectedAttr;
    const r = ref || referenceGroup;

    setLoading(true);
    try {
      const res = await api.runFairnessAudit({
        dataset_id: dId,
        protected_attribute: a,
        reference_group: r
      });
      setScorecard(res);
      if (res.reference_group && res.reference_group !== referenceGroup) {
        setReferenceGroup(res.reference_group);
      }
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
            PILLAR 2: FAIRNESS METRICS (CENTRAL MISSION)
          </span>
          <span className="text-xs text-slate-400 font-mono">Algorithmic Parity &amp; Opportunity Auditing</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">Quantitative Fairness Scorecard</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Calculates actual mathematical parity across protected candidate subgroups: Demographic Parity Ratio, Equal Opportunity Difference, and Average Odds Difference. Aggregates findings into the documented 0–100 Executive Fairness Health Index.
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-card-dark">
        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Dataset</label>
          <select
            value={selectedDatasetId}
            onChange={(e) => {
              setSelectedDatasetId(e.target.value);
              runAudit(e.target.value, protectedAttr, referenceGroup);
            }}
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
            onChange={(e) => {
              setProtectedAttr(e.target.value);
              runAudit(selectedDatasetId, e.target.value, undefined);
            }}
            className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7]"
          >
            <option value="gender">Gender (Male, Female, Non-Binary)</option>
            <option value="caste_category">Caste Category (General, OBC, SC, ST)</option>
            <option value="age_group">Age Group (&lt;25, 25-35, &gt;35)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Reference Group (Benchmark)</label>
          <input
            type="text"
            value={referenceGroup}
            onChange={(e) => setReferenceGroup(e.target.value)}
            className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7] w-28"
          />
        </div>

        <button
          onClick={() => runAudit()}
          disabled={loading}
          className="mt-4 sm:mt-auto px-4 py-2 rounded-lg bg-[#007BA7] hover:bg-[#0090C4] text-white text-xs font-mono font-bold tracking-wider shadow-cerulean-glow flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? "CALCULATING..." : "RECALCULATE METRICS"}</span>
        </button>
      </div>

      {scorecard && (
        <div className="space-y-6">
          {/* Executive Overview Banner */}
          <div className="bg-[#121217] border border-[#22222E] rounded-2xl p-6 shadow-card-dark grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Health Gauge */}
            <div className="flex items-center space-x-6 border-r border-[#22222E] pr-6">
              <FairnessHealthGauge score={scorecard.metrics.executive_fairness_score} size={130} strokeWidth={12} />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Overall Rating</span>
                <div className="text-xl font-extrabold text-white font-mono mt-1">
                  {scorecard.metrics.executive_fairness_score.toFixed(1)} / 100
                </div>
                <div className={`text-xs font-mono font-bold mt-2 ${
                  scorecard.compliance_status === "AUDIT_COMPLIANT" ? "text-emerald-400" : "text-[#FF2D95]"
                }`}>
                  {scorecard.compliance_status.replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            {/* Core Metrics */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-[#1E1E2A]">
                <span className="text-slate-400">Demographic Parity Ratio:</span>
                <strong className={`text-sm ${scorecard.metrics.demographic_parity_ratio >= 0.8 ? 'text-emerald-400' : 'text-[#FF2D95]'}`}>
                  {scorecard.metrics.demographic_parity_ratio.toFixed(3)}
                </strong>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-[#1E1E2A]">
                <span className="text-slate-400">Equal Opportunity Diff:</span>
                <strong className={`text-sm ${scorecard.metrics.equal_opportunity_difference <= 0.10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {scorecard.metrics.equal_opportunity_difference.toFixed(3)}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Average Odds Difference:</span>
                <strong className={`text-sm ${scorecard.metrics.average_odds_difference <= 0.10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {scorecard.metrics.average_odds_difference.toFixed(3)}
                </strong>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1E1E2A] text-xs font-sans text-slate-300">
              <div className="text-[10px] font-mono font-bold text-[#007BA7] uppercase mb-1">
                Recommendation:
              </div>
              <p className="leading-relaxed">
                {scorecard.recommendation}
              </p>
            </div>
          </div>

          {/* Group-by-Group Selection Rates & Confusion Matrix */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
              Subgroup Selection Rates &amp; Confusion Statistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {Object.entries(scorecard.group_stats).map(([gName, gStat]) => {
                const isRef = gName === scorecard.reference_group;
                const diRatio = scorecard.pairwise_metrics.disparate_impact_ratios[gName] ?? 1.0;
                const isAdverse = scorecard.pairwise_metrics.adverse_impact_flags[gName] ?? false;

                return (
                  <div
                    key={gName}
                    className={`bg-[#121217] border rounded-xl p-5 shadow-card-dark space-y-4 ${
                      isRef
                        ? "border-[#007BA7]"
                        : isAdverse
                        ? "border-[#FF2D95]"
                        : "border-[#22222E]"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#22222E]">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold font-mono text-white">{gName}</span>
                        {isRef && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#007BA7]/20 text-[#007BA7]">
                            REFERENCE
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        N = {gStat.sample_size}
                      </span>
                    </div>

                    {/* Selection Rate Display */}
                    <div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Selection Rate:</span>
                        <strong className="text-white">{(gStat.selection_rate * 100).toFixed(1)}%</strong>
                      </div>
                      <div className="w-full bg-[#0A0A0A] rounded-full h-2 mt-2 overflow-hidden border border-[#1A1A24]">
                        <div
                          className={`h-full rounded-full ${isRef ? 'bg-[#007BA7]' : isAdverse ? 'bg-[#FF2D95]' : 'bg-emerald-400'}`}
                          style={{ width: `${gStat.selection_rate * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Disparate Impact vs Reference */}
                    {!isRef && (
                      <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-[#1A1A24] text-xs font-mono flex items-center justify-between">
                        <span className="text-slate-400">80% Rule Ratio:</span>
                        <span className={`font-bold ${isAdverse ? 'text-[#FF2D95]' : 'text-emerald-400'}`}>
                          {diRatio.toFixed(3)} {isAdverse ? '(VIOLATION < 0.8)' : '(PASS)'}
                        </span>
                      </div>
                    )}

                    {/* Confusion Matrix if Available */}
                    {gStat.confusion_matrix && (
                      <div className="pt-2 border-t border-[#1E1E2A] text-[11px] font-mono space-y-1">
                        <div className="text-slate-500 uppercase text-[9px]">Confusion Matrix</div>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="p-1.5 bg-[#0A0A0A] rounded border border-[#1E1E2A]">
                            <div className="text-emerald-400 font-bold">{gStat.confusion_matrix.tp}</div>
                            <div className="text-[9px] text-slate-500">True Pos (TP)</div>
                          </div>
                          <div className="p-1.5 bg-[#0A0A0A] rounded border border-[#1E1E2A]">
                            <div className="text-amber-400 font-bold">{gStat.confusion_matrix.fp}</div>
                            <div className="text-[9px] text-slate-500">False Pos (FP)</div>
                          </div>
                          <div className="p-1.5 bg-[#0A0A0A] rounded border border-[#1E1E2A]">
                            <div className="text-red-400 font-bold">{gStat.confusion_matrix.fn}</div>
                            <div className="text-[9px] text-slate-500">False Neg (FN)</div>
                          </div>
                          <div className="p-1.5 bg-[#0A0A0A] rounded border border-[#1E1E2A]">
                            <div className="text-slate-400 font-bold">{gStat.confusion_matrix.tn}</div>
                            <div className="text-[9px] text-slate-500">True Neg (TN)</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
