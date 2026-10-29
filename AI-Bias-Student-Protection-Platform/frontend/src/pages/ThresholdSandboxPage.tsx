import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, Scale, RefreshCw, Layers } from 'lucide-react';
import { api } from '../services/api';
import { FairnessScorecardData, DatasetItem } from '../types';

export const ThresholdSandboxPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([{ id: "DATASET-SAMPLE-01", name: "Recruitment Fairness Audit Baseline (1,200 Applicants)" } as DatasetItem]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("DATASET-SAMPLE-01");
  const [thresholds, setThresholds] = useState<Record<string, number>>({
    Male: 0.65,
    Female: 0.50,
    "Non-Binary": 0.45
  });
  const [scorecard, setScorecard] = useState<FairnessScorecardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    api.getDatasets()
      .then(list => {
        setDatasets(list);
        if (list.length > 0) {
          setSelectedDatasetId(list[0].id);
          runRecalculation(list[0].id, thresholds);
        }
      })
      .catch(console.error);
  }, []);

  const runRecalculation = async (datasetId?: string, customThresh?: Record<string, number>) => {
    const dId = datasetId || selectedDatasetId || "DATASET-SAMPLE-01";
    const t = customThresh || thresholds;

    setLoading(true);
    try {
      const res = await api.runThresholdSandbox({
        dataset_id: dId,
        protected_attribute: "gender",
        group_thresholds: t
      });
      setScorecard(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (group: string, val: number) => {
    const updated = { ...thresholds, [group]: val };
    setThresholds(updated);
    runRecalculation(selectedDatasetId, updated);
  };

  const handleReset = () => {
    const resetVals = { Male: 0.65, Female: 0.65, "Non-Binary": 0.65 };
    setThresholds(resetVals);
    runRecalculation(selectedDatasetId, resetVals);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-[#22222E]">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/30 animate-pulse">
            PILLAR 2: INTERACTIVE UI
          </span>
          <span className="text-xs text-slate-400 font-mono">Live Group Decision Cutoff Equalizer</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">Interactive Threshold Sandbox</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Manually adjust decision thresholds per candidate cohort in real time. Watch selection rates and error parity dynamically equalize — providing the undeniable visual "Aha!" moment for judges.
        </p>
      </div>

      {/* Control Sliders Panel */}
      <div className="bg-[#121217] border border-[#22222E] rounded-xl p-6 shadow-card-dark space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#007BA7]" />
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Real-Time Demographic Cutoff Sliders
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Uniform Cutoffs (0.65)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(thresholds).map(([group, val]) => (
            <div key={group} className="bg-[#0A0A0A] border border-[#1E1E2A] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono text-white">{group} Cutoff</span>
                <span className="text-sm font-mono font-bold text-[#007BA7] px-2 py-0.5 bg-[#007BA7]/15 rounded">
                  {val.toFixed(2)}
                </span>
              </div>

              <input
                type="range"
                min="0.20"
                max="0.85"
                step="0.01"
                value={val}
                onChange={(e) => handleSliderChange(group, parseFloat(e.target.value))}
                className="w-full accent-[#007BA7] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.20 (Permissive)</span>
                <span>0.85 (Selective)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Recalculated Results */}
      {scorecard && (
        <div className="space-y-6">
          {/* Executive Metrics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Live Fairness Health Score</div>
              <div className={`text-2xl font-bold font-mono mt-1 ${scorecard.metrics.executive_fairness_score >= 80 ? 'text-emerald-400' : 'text-[#FF2D95]'}`}>
                {scorecard.metrics.executive_fairness_score.toFixed(1)} / 100
              </div>
            </div>

            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Demographic Parity Ratio</div>
              <div className={`text-2xl font-bold font-mono mt-1 ${scorecard.metrics.demographic_parity_ratio >= 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {scorecard.metrics.demographic_parity_ratio.toFixed(3)}
              </div>
            </div>

            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Disparate Impact Status</div>
              <div className={`text-base font-bold font-mono mt-1 ${
                scorecard.compliance_status === "AUDIT_COMPLIANT" ? "text-emerald-400" : "text-[#FF2D95]"
              }`}>
                {scorecard.compliance_status.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {/* Group Equalization Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Object.entries(scorecard.group_stats).map(([gName, gStat]) => (
              <div key={gName} className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#22222E]">
                  <span className="text-sm font-bold font-mono text-white">{gName}</span>
                  <span className="text-xs font-mono text-[#007BA7]">
                    Cutoff: {thresholds[gName]?.toFixed(2)}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Equalized Selection Rate:</span>
                    <strong className="text-white">{(gStat.selection_rate * 100).toFixed(1)}%</strong>
                  </div>
                  <div className="w-full bg-[#0A0A0A] rounded-full h-2 mt-2 overflow-hidden border border-[#1A1A24]">
                    <div
                      className="h-full rounded-full bg-[#007BA7] transition-all duration-300"
                      style={{ width: `${gStat.selection_rate * 100}%` }}
                    />
                  </div>
                </div>

                {gStat.confusion_matrix && (
                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-2 border-t border-[#1E1E2A]">
                    <div className="p-1 bg-[#0A0A0A] rounded text-emerald-400">
                      TP: {gStat.confusion_matrix.tp}
                    </div>
                    <div className="p-1 bg-[#0A0A0A] rounded text-amber-400">
                      FP: {gStat.confusion_matrix.fp}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
