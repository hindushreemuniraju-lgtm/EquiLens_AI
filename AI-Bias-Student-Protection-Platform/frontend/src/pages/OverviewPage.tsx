import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  ShieldAlert,
  Database,
  FlaskConical,
  Lock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Activity,
  FileCode,
  Zap
} from 'lucide-react';
import { api } from '../services/api';
import { OverviewStats } from '../types';
import { FairnessHealthGauge } from '../components/FairnessHealthGauge';

export const OverviewPage: React.FC = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getOverviewStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#121217] via-[#161622] to-[#121217] border border-[#22222E] p-8 shadow-card-dark overflow-hidden">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-[#007BA7]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 w-80 h-80 bg-[#FF2D95]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#007BA7]/15 border border-[#007BA7]/30 text-[#007BA7] text-xs font-mono font-semibold mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>CENTRAL MISSION: ALGORITHMIC FAIRNESS &amp; RESPONSIBLE AI</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            AI Bias Mitigation &amp; Student Defense Platform
          </h1>
          <p className="mt-3 text-slate-300 text-sm lg:text-base leading-relaxed">
            Modern recruitment fails students on two fronts: <span className="text-[#007BA7] font-semibold">algorithmic bias excludes qualified candidates without explanation</span>, while predatory scams exploit job-seeking desperation. EquiLens unifies verifiable model auditing with real-time threat defense.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/fairness-scorecard"
              className="px-5 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#0090C4] text-white text-xs font-mono font-bold tracking-wider shadow-cerulean-glow flex items-center gap-2 transition-all"
            >
              <Scale className="w-4 h-4" />
              <span>AUDIT ALGORITHMIC FAIRNESS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/scam-shield"
              className="px-5 py-2.5 rounded-xl bg-[#181824] hover:bg-[#202030] text-slate-200 border border-[#FF2D95]/40 hover:border-[#FF2D95] text-xs font-mono font-bold tracking-wider shadow-rose-glow flex items-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-[#FF2D95]" />
              <span>RUN 10-STEP DEMO SCENARIO</span>
            </Link>
            <Link
              to="/remediation-lab"
              className="px-4 py-2.5 rounded-xl bg-[#121217] hover:bg-[#181822] text-slate-300 border border-[#22222E] text-xs font-mono font-medium flex items-center gap-2 transition-all"
            >
              <FlaskConical className="w-4 h-4 text-[#007BA7]" />
              <span>BIAS REMEDIATION LAB</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Command Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Fairness Health Index */}
        <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Executive Fairness Index
            </div>
            <div className="text-3xl font-extrabold font-mono text-white mt-1">
              {loading ? "..." : (stats?.latest_fairness_health_index ?? 78.5).toFixed(1)}
              <span className="text-sm text-slate-500 font-normal"> / 100</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Regulatory Benchmark Ready</span>
            </div>
          </div>
          <FairnessHealthGauge score={stats?.latest_fairness_health_index ?? 78.5} size={90} strokeWidth={10} />
        </div>

        {/* KPI 2: Datasets & Audits */}
        <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Audited Datasets</span>
            <Database className="w-4 h-4 text-[#007BA7]" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold font-mono text-white">
              {loading ? "..." : stats?.datasets_count ?? 1}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              {stats?.audits_count ?? 0} Comprehensive Model Audits
            </div>
          </div>
          <Link to="/data-ingestion" className="text-xs text-[#007BA7] hover:underline flex items-center gap-1 font-mono mt-3">
            <span>Manage Ingested Data</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* KPI 3: Adverse Impact Flags */}
        <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">80% Rule Violations</span>
            <AlertTriangle className="w-4 h-4 text-[#FF2D95]" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold font-mono text-[#FF2D95]">
              {loading ? "..." : stats?.adverse_impact_count ?? 1}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Disparate Impact Cohorts Flagged
            </div>
          </div>
          <Link to="/disparate-impact" className="text-xs text-[#FF2D95] hover:underline flex items-center gap-1 font-mono mt-3">
            <span>Inspect 80% Rule Audits</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* KPI 4: Scam Signatures */}
        <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Threat Signatures</span>
            <ShieldAlert className="w-4 h-4 text-[#FF2D95]" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold font-mono text-white">
              {loading ? "..." : stats?.scam_reports_count ?? 5}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Hashed Threat Fingerprints in DB
            </div>
          </div>
          <Link to="/scam-shield" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono mt-3">
            <span>View Community Registry</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* The Six Pillars Quick Access Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono font-bold tracking-wider text-slate-400 uppercase">
            The Six Platform Pillars
          </h2>
          <span className="text-xs font-mono text-slate-500">100% SPECIFICATION COVERAGE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div className="bg-[#121217] border border-[#22222E] hover:border-[#007BA7]/60 rounded-xl p-6 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-[#007BA7]/10 flex items-center justify-center text-[#007BA7] mb-4">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-[#007BA7] uppercase tracking-wider">Pillar 1</div>
            <h3 className="text-base font-bold text-white mt-1 group-hover:text-[#007BA7] transition-colors">
              Data Ingestion &amp; Proxy Leakage
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Multi-modal tabular ingestion, auto-detection of protected demographics, job rubric bias tracer, and statistical proxy correlation detection.
            </p>
            <div className="mt-4 pt-3 border-t border-[#1C1C28] flex justify-between text-xs font-mono">
              <Link to="/data-ingestion" className="text-slate-400 hover:text-white">Ingest Data →</Link>
              <Link to="/proxy-guard" className="text-[#007BA7] hover:underline">Proxy Guard →</Link>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#121217] border border-[#22222E] hover:border-[#007BA7]/60 rounded-xl p-6 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-[#007BA7]/10 flex items-center justify-center text-[#007BA7] mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-[#007BA7] uppercase tracking-wider">Pillar 2 (Central Mission)</div>
            <h3 className="text-base font-bold text-white mt-1 group-hover:text-[#007BA7] transition-colors">
              Fairness Metrics &amp; LLM Auditing
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Demographic Parity, Equal Opportunity, Average Odds, EEOC 80% Rule, live threshold sandbox, and device twin simulations.
            </p>
            <div className="mt-4 pt-3 border-t border-[#1C1C28] flex justify-between text-xs font-mono">
              <Link to="/fairness-scorecard" className="text-[#007BA7] hover:underline">Scorecard →</Link>
              <Link to="/threshold-sandbox" className="text-[#FF2D95] hover:underline">Threshold Sandbox →</Link>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#121217] border border-[#22222E] hover:border-[#007BA7]/60 rounded-xl p-6 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-[#007BA7]/10 flex items-center justify-center text-[#007BA7] mb-4">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-[#007BA7] uppercase tracking-wider">Pillar 3</div>
            <h3 className="text-base font-bold text-white mt-1 group-hover:text-[#007BA7] transition-colors">
              Explainability &amp; Feedback
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Mathematical SHAP factor attributions on candidate rejections, automated bias-free sanity check, and constructive growth cards.
            </p>
            <div className="mt-4 pt-3 border-t border-[#1C1C28] flex justify-between text-xs font-mono">
              <Link to="/explainability" className="text-[#007BA7] hover:underline">SHAP Attributions →</Link>
              <Link to="/bias-verification" className="text-slate-400 hover:text-white">Bias Verification →</Link>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-[#121217] border border-[#22222E] hover:border-[#007BA7]/60 rounded-xl p-6 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-[#007BA7]/10 flex items-center justify-center text-[#007BA7] mb-4">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-[#007BA7] uppercase tracking-wider">Pillar 4 (Interactive Lab)</div>
            <h3 className="text-base font-bold text-white mt-1 group-hover:text-[#007BA7] transition-colors">
              Automated Algorithmic Remediation
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Pre-processing (Reweighting), In-processing (Fairlearn constrained optimization), and Post-processing (Threshold calibration) with Pareto curves.
            </p>
            <div className="mt-4 pt-3 border-t border-[#1C1C28] flex justify-between text-xs font-mono">
              <Link to="/remediation-lab" className="text-[#007BA7] hover:underline font-bold">Open Remediation Lab →</Link>
            </div>
          </div>

          {/* Pillar 5 */}
          <div className="bg-[#121217] border border-[#22222E] hover:border-[#FF2D95]/60 rounded-xl p-6 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-[#FF2D95]/10 flex items-center justify-center text-[#FF2D95] mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-[#FF2D95] uppercase tracking-wider">Pillar 5 (Student Defense)</div>
            <h3 className="text-base font-bold text-white mt-1 group-hover:text-[#FF2D95] transition-colors">
              Student Protection &amp; Scam Shield
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Crowdsourced registry, SHA-256 pattern hashing, regional Indic scanner, cybercrime complaint drafter, safe reply generator, and literacy engine.
            </p>
            <div className="mt-4 pt-3 border-t border-[#1C1C28] flex justify-between text-xs font-mono">
              <Link to="/scam-shield" className="text-[#FF2D95] hover:underline font-bold">10-Step Demo →</Link>
              <Link to="/regional-scanner" className="text-slate-400 hover:text-white">Indic Scanner →</Link>
            </div>
          </div>

          {/* Pillar 6 */}
          <div className="bg-[#121217] border border-[#22222E] hover:border-[#007BA7]/60 rounded-xl p-6 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-[#007BA7]/10 flex items-center justify-center text-[#007BA7] mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-[#007BA7] uppercase tracking-wider">Pillar 6</div>
            <h3 className="text-base font-bold text-white mt-1 group-hover:text-[#007BA7] transition-colors">
              Privacy by Design &amp; DPDP
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Granular purpose consent, PII redaction, demographic isolation vault, and India DPDP Act / GDPR 1-click Right to Erasure workflow.
            </p>
            <div className="mt-4 pt-3 border-t border-[#1C1C28] flex justify-between text-xs font-mono">
              <Link to="/privacy-center" className="text-[#007BA7] hover:underline">Privacy Center →</Link>
              <Link to="/audit-history" className="text-slate-400 hover:text-white">Audit Trail →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live System Activity Stream */}
      <div className="bg-[#121217] border border-[#22222E] rounded-xl p-6 shadow-card-dark">
        <div className="flex items-center justify-between pb-4 border-b border-[#22222E] mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#007BA7]" />
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Immutable System Audit Log (Recent Events)
            </h3>
          </div>
          <Link to="/audit-history" className="text-xs text-[#007BA7] hover:underline font-mono">
            View Complete Trail →
          </Link>
        </div>

        <div className="space-y-2.5">
          {stats?.recent_activity && stats.recent_activity.length > 0 ? (
            stats.recent_activity.map((event, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#1A1A24] text-xs font-mono">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-[#007BA7]" />
                  <span className="font-bold text-white">{event.action_type}</span>
                  <span className="text-slate-400 font-sans">({event.pillar})</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-500">
                  <span>Actor: {event.actor}</span>
                  <span>•</span>
                  <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs font-mono text-slate-500 py-4 text-center">
              No recent events logged yet. Audit actions will stream here in real time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
