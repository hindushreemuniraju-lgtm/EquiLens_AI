import React, { useState, useEffect } from 'react';
import { KeyRound, AlertTriangle, ShieldCheck, Info, BarChart2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { ProxyLeakageResult, DatasetItem } from '../types';

export const ProxyGuardPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("");
  const [protectedAttr, setProtectedAttr] = useState<string>("gender");
  const [result, setResult] = useState<ProxyLeakageResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    api.getDatasets()
      .then(list => {
        setDatasets(list);
        if (list.length > 0) {
          setSelectedDatasetId(list[0].id);
          runAnalysis(list[0].id, "gender");
        }
      })
      .catch(console.error);
  }, []);

  const runAnalysis = async (datasetId?: string, attr?: string) => {
    const dId = datasetId || selectedDatasetId;
    const a = attr || protectedAttr;
    if (!dId) return;

    setLoading(true);
    try {
      const res = await api.runProxyAnalysis({
        dataset_id: dId,
        protected_attribute: a
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
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/30">
            PILLAR 1: PROXY LEAKAGE
          </span>
          <span className="text-xs text-slate-400 font-mono">Latent Indirect Association Scanner</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">Proxy Leakage Guard</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Surfaces hidden indirect correlations between non-sensitive features (e.g., postal codes, college tier, graduation year) and protected groups. <strong className="text-slate-200">Proves that simply dropping the "gender" or "caste" column does not eliminate algorithmic discrimination.</strong>
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-card-dark">
        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Target Dataset</label>
          <select
            value={selectedDatasetId}
            onChange={(e) => {
              setSelectedDatasetId(e.target.value);
              runAnalysis(e.target.value, protectedAttr);
            }}
            className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7]"
          >
            {datasets.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.row_count} rows)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Audit Demographic Cohort</label>
          <select
            value={protectedAttr}
            onChange={(e) => {
              setProtectedAttr(e.target.value);
              runAnalysis(selectedDatasetId, e.target.value);
            }}
            className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7]"
          >
            <option value="gender">Gender (Male / Female / Non-Binary)</option>
            <option value="caste_category">Caste Category (General / OBC / SC / ST)</option>
            <option value="age_group">Age Group (&lt;25 / 25-35 / &gt;35)</option>
          </select>
        </div>

        <button
          onClick={() => runAnalysis()}
          disabled={loading}
          className="mt-4 sm:mt-auto px-4 py-2 rounded-lg bg-[#007BA7] hover:bg-[#0090C4] text-white text-xs font-mono font-bold tracking-wider shadow-cerulean-glow transition-all"
        >
          {loading ? "SCANNING PROXIES..." : "RE-SCAN PROXY LEAKAGE"}
        </button>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="p-5 rounded-xl bg-[#121217] border border-[#22222E] shadow-card-dark flex items-start gap-4">
            <div className={`p-2.5 rounded-lg ${result.high_risk_proxy_count > 0 ? 'bg-[#FF2D95]/15 text-[#FF2D95]' : 'bg-emerald-500/15 text-emerald-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white">
                Proxy Audit Findings for: <span className="text-[#007BA7]">"{result.protected_attribute}"</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {result.overall_summary}
              </p>
              <div className="mt-2 text-[11px] font-mono text-slate-400">
                Total Candidate Features Evaluated: <strong className="text-white">{result.features_evaluated_count}</strong> | High-Risk Surrogates: <strong className="text-[#FF2D95]">{result.high_risk_proxy_count}</strong>
              </div>
            </div>
          </div>

          {/* Proxy Correlation List / Heatmap Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Feature Association Spectrum (Cramer's V &amp; ANOVA η)
            </h3>

            {result.proxy_findings.map((item, idx) => {
              const pct = (item.association_score * 100).toFixed(1);
              const isHigh = item.risk_level === "HIGH";
              const isMed = item.risk_level === "MEDIUM";

              return (
                <div
                  key={idx}
                  className={`bg-[#121217] border rounded-xl p-4 transition-all shadow-card-dark ${
                    isHigh
                      ? "border-[#FF2D95]/40 hover:border-[#FF2D95]"
                      : isMed
                      ? "border-amber-500/30 hover:border-amber-500/60"
                      : "border-[#22222E] hover:border-slate-600"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isHigh
                          ? "bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/40"
                          : isMed
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}>
                        {item.risk_level} RISK PROXY
                      </span>
                      <span className="text-sm font-bold font-mono text-white">{item.feature}</span>
                    </div>

                    <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
                      <span>Method: {item.method}</span>
                      <span className="font-bold text-white">Score: {item.association_score} ({pct}%)</span>
                    </div>
                  </div>

                  {/* Association Visual Bar */}
                  <div className="w-full bg-[#0A0A0A] rounded-full h-2 mt-3 overflow-hidden border border-[#1A1A24]">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isHigh ? 'bg-[#FF2D95]' : isMed ? 'bg-amber-400' : 'bg-[#007BA7]'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, item.association_score * 100))}%` }}
                    />
                  </div>

                  {/* Recommendation Note */}
                  <p className="text-xs text-slate-300 mt-3 font-sans leading-relaxed">
                    <strong className="text-slate-200">Mitigation Advice:</strong> {item.recommendation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
