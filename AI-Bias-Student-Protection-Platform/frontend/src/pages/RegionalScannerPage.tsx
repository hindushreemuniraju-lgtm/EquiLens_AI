import React, { useState } from 'react';
import { Languages, AlertTriangle, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { api } from '../services/api';

const SAMPLES = [
    {
        title: "Hindi (Devanagari)",
        text: "बधाई हो! आपका चयन Microsoft में हुआ है। नियुक्ति पत्र प्राप्त करने के लिए ₹1500 रजिस्ट्रेशन शुल्क 9876543210 पर GPay करें।"
    },
    {
        title: "Kannada (ಕನ್ನಡ)",
        text: "ಅಭಿನಂದನೆಗಳು! Infosys ಕ್ಯಾಂಪಸ್ ಆಯ್ಕೆ ಖಚಿತವಾಗಿದೆ. ಲ್ಯಾಪ್ಟಾಪ್ ವಿಮೆಗಾಗಿ ₹3000 ಹಣವನ್ನು ಈ ಲಿಂಕ್ ಮೂಲಕ ಪಾವತಿಸಿ: http://infosys-careers.fakejobs.in"
    },
    {
        title: "Hinglish (Code-Mixed)",
        text: "Congratulations! Aapka selection confirm ho gaya hai. Offer letter ke liye turant ₹2000 registration fees pay karo WhatsApp par."
    },
    {
        title: "Tamil (தமிழ்)",
        text: "வேலை உறுதி! பணி நியமன கடிதம் பெற பயிற்சி கட்டணம் ₹2500 உடனடியாக செலுத்தவும்."
    }
];

export const RegionalScannerPage: React.FC = () => {
    const [messageText, setMessageText] = useState<string>(SAMPLES[0].text);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleScan = async (text?: string) => {
        const t = text || messageText;
        if (!t.trim()) return;

        setLoading(true);
        try {
            const res = await api.scanMultilingual(t);
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
                        PILLAR 5: REGIONAL INDIC NLP
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Multilingual &amp; Code-Mixed Threat Engine</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white mt-1">Regional Language Anti-Scam Scanner</h1>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    Full detection capability across <strong>Hindi, Kannada, Tamil, Telugu, Hinglish, and Tanglish</strong>. Identifies regional recruitment extortion keywords, native script urgency cues, and code-mixed scams targeting non-metro students.
                </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#007BA7]" />
                    Regional Test Samples:
                </span>
                {SAMPLES.map((s, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setMessageText(s.text);
                            handleScan(s.text);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#121217] hover:bg-[#1C1C28] border border-[#22222E] hover:border-[#FF2D95] text-xs font-mono text-slate-300 transition-colors"
                    >
                        {s.title}
                    </button>
                ))}
            </div>

            {/* Input Box */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#22222E]">
                    <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                        Regional or Code-Mixed Message Text
                    </label>
                    <button
                        onClick={() => handleScan()}
                        disabled={loading}
                        className="px-4 py-1.5 rounded-lg bg-[#FF2D95] hover:bg-[#FF45A3] text-white text-xs font-mono font-bold tracking-wider shadow-rose-glow flex items-center gap-1.5 transition-all"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{loading ? "SCANNING..." : "SCAN REGIONAL INDIC TEXT"}</span>
                    </button>
                </div>

                <textarea
                    rows={4}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#22222E] rounded-lg p-3 text-sm font-sans text-slate-200 focus:outline-none focus:border-[#FF2D95] leading-relaxed resize-y"
                />
            </div>

            {/* Scan Findings */}
            {result && (
                <div className="space-y-6">
                    {/* Language Detection Bar */}
                    <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Detected Regional Dialects</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {result.detected_languages.map((l: string, i: number) => (
                                    <span key={i} className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
                                        {l}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Regional Threat Score</span>
                            <div className="text-2xl font-bold font-mono text-[#FF2D95] mt-0.5">
                                {result.regional_threat_score} / 100
                            </div>
                        </div>
                    </div>

                    {/* Matched Regional Lexicon Indicators */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                            Matched Regional Fraud Triggers ({result.matched_regional_indicators.length})
                        </h3>

                        {result.matched_regional_indicators.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.matched_regional_indicators.map((ind: any, i: number) => (
                                    <div key={i} className="bg-[#121217] border border-[#FF2D95]/30 rounded-xl p-4 shadow-card-dark space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold font-mono text-white">{ind.language}</span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF2D95]/20 text-[#FF2D95]">
                                                {ind.type}
                                            </span>
                                        </div>

                                        <div className="text-base font-bold text-[#FF2D95] bg-[#0A0A0A] p-2.5 rounded border border-[#1E1E2A]">
                                            "{ind.matched_term}"
                                        </div>

                                        <div className="text-xs font-mono text-slate-300">
                                            English Meaning: <strong className="text-emerald-400">{ind.english_translation}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-[#121217] border border-[#22222E] rounded-xl text-xs font-mono text-slate-400 text-center">
                                No regional scam indicators triggered for this input.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
