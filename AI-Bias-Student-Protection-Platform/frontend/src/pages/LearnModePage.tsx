import React, { useState, useEffect } from 'react';
import { GraduationCap, CheckCircle2, XCircle, AlertTriangle, ArrowRight, RefreshCw, Trophy, BookOpen } from 'lucide-react';
import { api } from '../services/api';

export const LearnModePage: React.FC = () => {
    const [modules, setModules] = useState<any[]>([]);
    const [activeIdx, setActiveIdx] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<any>(null);
    const [score, setScore] = useState<number>(0);
    const [completedCases, setCompletedCases] = useState<Set<string>>(new Set());

    useEffect(() => {
        api.getLearnModules()
            .then(data => {
                setModules(data);
            })
            .catch(console.error);
    }, []);

    const currentCase = modules[activeIdx];

    const handleSubmitAnswer = async () => {
        if (selectedOption === null || !currentCase) return;

        try {
            const res = await api.submitQuizAnswer(currentCase.id, selectedOption);
            setFeedback(res);
            if (res.is_correct && !completedCases.has(currentCase.id)) {
                setScore(score + 100);
                setCompletedCases(new Set(completedCases).add(currentCase.id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleNext = () => {
        if (activeIdx < modules.length - 1) {
            setActiveIdx(activeIdx + 1);
            setSelectedOption(null);
            setFeedback(null);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            {/* Header */}
            <div className="pb-4 border-b border-[#22222E]">
                <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
                        PILLAR 5: LITERACY ENGINE
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Interactive Student Cybersecurity Training</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white mt-1">Student Cybersecurity Learn Mode</h1>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    Build lasting digital defense skills by analyzing real-world recruitment social engineering scams. Spot artificial urgency, fake corporate domains, and advance-fee extortion patterns independently.
                </p>
            </div>

            {/* Score & Progress Tracker */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#007BA7]/10 text-[#007BA7] flex items-center justify-center font-bold">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Literacy Mastery Score</span>
                        <div className="text-2xl font-bold font-mono text-white mt-0.5">
                            {score} <span className="text-xs text-slate-500 font-normal">XP</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {modules.map((m, i) => (
                        <button
                            key={m.id}
                            onClick={() => {
                                setActiveIdx(i);
                                setSelectedOption(null);
                                setFeedback(null);
                            }}
                            className={`w-9 h-9 rounded-lg font-mono text-xs font-bold transition-all ${
                                activeIdx === i
                                    ? "bg-[#007BA7] text-white shadow-cerulean-glow"
                                    : completedCases.has(m.id)
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-[#181822] text-slate-400 border border-[#262636]"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Scenario Card */}
            {currentCase && (
                <div className="bg-[#121217] border border-[#22222E] rounded-2xl p-7 shadow-card-dark space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
                        <div>
                            <span className="text-[10px] font-mono text-[#007BA7] uppercase tracking-wider block">
                                Case {activeIdx + 1} of {modules.length} • {currentCase.category}
                            </span>
                            <h2 className="text-lg font-bold font-mono text-white mt-0.5">
                                {currentCase.title}
                            </h2>
                        </div>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/30">
                            {currentCase.difficulty}
                        </span>
                    </div>

                    {/* Scenario Narrative */}
                    <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#1E1E2A] space-y-2">
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#007BA7]" />
                            Real-World Student Case Simulation:
                        </span>
                        <p className="text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-line">
                            {currentCase.scenario}
                        </p>
                    </div>

                    {/* Question & Options */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold font-sans text-white">
                            {currentCase.interactive_question}
                        </h3>

                        <div className="space-y-3">
                            {currentCase.options.map((opt: string, idx: number) => {
                                const isSelected = selectedOption === idx;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => !feedback && setSelectedOption(idx)}
                                        className={`p-4 rounded-xl border text-xs font-sans cursor-pointer transition-all ${
                                            isSelected
                                                ? "bg-[#181824] border-[#007BA7] text-white shadow-sm"
                                                : "bg-[#0A0A0A] border-[#1E1E2A] text-slate-300 hover:border-slate-600"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                                                isSelected ? "bg-[#007BA7] text-white" : "bg-[#181824] text-slate-400"
                                            }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span>{opt}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action & Feedback */}
                    {!feedback ? (
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={selectedOption === null}
                                className="px-6 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#0090C4] disabled:opacity-50 text-white text-xs font-mono font-bold tracking-wider shadow-cerulean-glow transition-all"
                            >
                                SUBMIT ANSWER
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 pt-4 border-t border-[#1E1E2A]">
                            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                                feedback.is_correct
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                    : "bg-[#FF2D95]/10 border-[#FF2D95]/30 text-[#FF2D95]"
                            }`}>
                                {feedback.is_correct ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                                <div>
                                    <div className="font-bold font-mono text-sm">
                                        {feedback.is_correct ? "CORRECT! +100 XP" : "INCORRECT RESPONSE"}
                                    </div>
                                    <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                                        {feedback.explanation}
                                    </p>
                                </div>
                            </div>

                            {/* Red Flags Summary */}
                            <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#1E1E2A] space-y-2">
                                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                                    Red Flags Identified in this Modus Operandi:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                                    {(feedback.red_flags || []).map((rf: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D95]" />
                                            <span>{rf}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                {activeIdx < modules.length - 1 ? (
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#0090C4] text-white text-xs font-mono font-bold tracking-wider shadow-cerulean-glow flex items-center gap-2 transition-all"
                                    >
                                        <span>NEXT CASE STUDY</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <span className="text-xs font-mono text-emerald-400 font-bold">
                                        ALL MODULES COMPLETED! YOU ARE A CERTIFIED DEFENDER.
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
