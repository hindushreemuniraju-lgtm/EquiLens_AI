import React, { useState, useEffect } from 'react';
import { Video, WifiOff, AlertTriangle, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const DeviceTwinPage: React.FC = () => {
  const [selectedTransformation, setSelectedTransformation] = useState<string>("bandwidth_throttle");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runSimulation = async (type?: string) => {
    const t = type || selectedTransformation;
    setLoading(true);
    try {
      const res = await api.simulateDeviceTwin(t);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation("bandwidth_throttle");
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-[#22222E]">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
            PILLAR 2: COUNTERFACTUAL MEDIA
          </span>
          <span className="text-xs text-slate-400 font-mono">Connectivity &amp; Hardware Disparity Twin</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">Connectivity &amp; Device Twin</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Simulates audio and video degradation (dropped frames, reduced codec bitrate, low-light sensor noise, and network packet loss) to evaluate whether automated video interview evaluators discriminate against candidates with constrained hardware and rural connectivity.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: "bandwidth_throttle", label: "Bandwidth Throttle (256 kbps)", icon: WifiOff },
          { id: "dropped_frames", label: "Dropped Video Frames (5 fps)", icon: Video },
          { id: "low_bitrate_audio", label: "Acoustic Audio Codec (8 kHz)", icon: Cpu },
          { id: "low_light_simulation", label: "Sensor Noise & Low Light", icon: AlertTriangle }
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = selectedTransformation === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedTransformation(item.id);
                runSimulation(item.id);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-[#181824] border-[#007BA7] shadow-cerulean-glow"
                  : "bg-[#121217] border-[#22222E] hover:border-slate-600 text-slate-400"
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-[#007BA7]" : "text-slate-500"}`} />
              <div className={`text-xs font-mono font-bold ${isSelected ? "text-white" : "text-slate-300"}`}>
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Simulation Results View */}
      {result && (
        <div className="space-y-6">
          {/* Main Comparison Banner */}
          <div className="bg-[#121217] border border-[#22222E] rounded-2xl p-6 shadow-card-dark grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Left: High-Bandwidth Baseline */}
            <div className="bg-[#0A0A0A] border border-[#1E1E2A] rounded-xl p-5 text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Standard / Fiber High-Bandwidth Candidate
              </span>
              <div className="text-3xl font-extrabold font-mono text-emerald-400">
                {result.evaluator_sensitivity.original_fluency_score.toFixed(1)} / 100
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Evaluator Recommendation: <strong className="text-emerald-400">HIRE (PASS)</strong>
              </div>
            </div>

            {/* Middle: Counterfactual Disparity Gap */}
            <div className="text-center space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
                Counterfactual Sensitivity Gap
              </span>
              <div className="text-4xl font-extrabold font-mono text-[#FF2D95]">
                {result.evaluator_sensitivity.score_drop.toFixed(1)} pts
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/30 inline-block">
                FALSE REJECTION DUE TO HARDWARE
              </span>
            </div>

            {/* Right: Degraded Twin Candidate */}
            <div className="bg-[#0A0A0A] border border-[#FF2D95]/30 rounded-xl p-5 text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#FF2D95] uppercase tracking-wider block">
                Degraded Connectivity Twin Candidate
              </span>
              <div className="text-3xl font-extrabold font-mono text-[#FF2D95]">
                {result.evaluator_sensitivity.degraded_fluency_score.toFixed(1)} / 100
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Evaluator Recommendation: <strong className="text-[#FF2D95]">REJECTED</strong>
              </div>
            </div>
          </div>

          {/* Technical Specs & Policy Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Transformation Pipeline Specifications
              </h3>
              <div className="text-xs font-mono text-slate-300 space-y-1.5">
                <div><span className="text-slate-500">Transformation:</span> {result.name}</div>
                <div><span className="text-slate-500">Technical Details:</span> {result.technical_specs}</div>
                <div><span className="text-slate-500">Pipeline Status:</span> {result.processing_mode}</div>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-2 leading-relaxed">
                {result.description}
              </p>
            </div>

            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Evaluator Disparity Analysis &amp; Policy
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#0A0A0A] p-3 rounded-lg border border-[#1E1E2A]">
                {result.evaluator_sensitivity.evaluator_disparity_note}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                <strong className="text-emerald-400">Responsible AI Safeguard:</strong> {result.policy_recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
