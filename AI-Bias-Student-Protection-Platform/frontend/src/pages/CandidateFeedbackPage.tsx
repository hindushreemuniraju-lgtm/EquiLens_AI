import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, TrendingUp, BookOpen, Sparkles, HeartHandshake } from 'lucide-react';
import { api } from '../services/api';
import { ShapExplanationResult } from '../types';

export const CandidateFeedbackPage: React.FC = () => {
  const [candidateId, setCandidateId] = useState<string>("CAND-10023");
  const [data, setData] = useState<ShapExplanationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    api.explainCandidate({ candidate_id: candidateId })
      .then(setData)
      .catch(console.error);
  }, [candidateId]);

  const feedback = data?.candidate_feedback_card;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-[#22222E]">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
            PILLAR 3: FEEDBACK
          </span>
          <span className="text-xs text-slate-400 font-mono">Transparent Growth Pathways &amp; Benchmarks</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">Constructive Candidate Feedback Card</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Empowers rejected applicants with actionable, constructive feedback detailing candidate strengths, target skill benchmarks, and curated learning roadmaps rather than ghosting them after rejection.
        </p>
      </div>

      {feedback && (
        <div className="space-y-6 max-w-4xl">
          {/* Card Shell */}
          <div className="bg-[#121217] border border-[#22222E] rounded-2xl p-7 shadow-card-dark space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22222E] gap-2">
              <div>
                <span className="text-[10px] font-mono text-[#007BA7] uppercase tracking-wider block">
                  Confidential Candidate Feedback
                </span>
                <h2 className="text-xl font-bold font-mono text-white mt-0.5">
                  Applicant: {feedback.candidate_name} ({candidateId})
                </h2>
              </div>
              <div className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                {feedback.decision_summary}
              </div>
            </div>

            {/* Strengths */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Demonstrated Strengths in Evaluation
              </h3>

              <div className="space-y-2">
                {feedback.strengths.map((str, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs font-sans text-slate-200 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competency Growth Benchmarks */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Target Competency Benchmarks for Next Cycle
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.growth_areas.map((g, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1E1E2A] space-y-2 shadow-sm">
                    <div className="text-xs font-bold font-mono text-white">
                      {g.competency}
                    </div>
                    <div className="flex justify-between text-xs font-mono text-slate-400 pt-1 border-t border-[#1E1E2A]">
                      <span>Your Score: <strong className="text-[#FF2D95]">{g.candidate_level}</strong></span>
                      <span>Target: <strong className="text-emerald-400">{g.target_benchmark}</strong></span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                      {g.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Learning Pathways */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-[#007BA7] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#007BA7]" />
                Curated Learning Pathways &amp; Project Suggestions
              </h3>

              <div className="space-y-2">
                {feedback.recommended_learning_pathways.map((path, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#007BA7]/10 border border-[#007BA7]/20 text-xs font-sans text-slate-200 flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#007BA7] shrink-0" />
                    <span>{path}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Mindset Footer */}
            <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1E1E2A] flex items-center gap-3 text-xs font-sans text-slate-300">
              <HeartHandshake className="w-5 h-5 text-[#FF2D95] shrink-0" />
              <p>{feedback.growth_mindset_message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
