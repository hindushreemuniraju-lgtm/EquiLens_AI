import React, { useState, useEffect } from 'react';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface Props {
  originalText: string;
  redactedText: string;
  redactions: {
    label: string;
    original: string;
    replacement: string;
  }[];
  onAnimationComplete?: () => void;
}

export const LiveTypewriterRedactor: React.FC<Props> = ({
  originalText,
  redactedText,
  redactions,
  onAnimationComplete
}) => {
  const [displayedText, setDisplayedText] = useState<string>(originalText);
  const [isRedacted, setIsRedacted] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    setIsAnimating(true);
    setIsRedacted(false);
    setDisplayedText(originalText);

    // After 800ms, start live transition to redacted tokens
    const timer = setTimeout(() => {
      setDisplayedText(redactedText);
      setIsRedacted(true);
      setIsAnimating(false);
      if (onAnimationComplete) onAnimationComplete();
    }, 1200);

    return () => clearTimeout(timer);
  }, [originalText, redactedText]);

  // Render text with styled tokens
  const renderStyledTokens = (text: string) => {
    const parts = text.split(/(\[[A-Z_]+\])/g);
    return parts.map((part, idx) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span
            key={idx}
            className="inline-flex items-center px-2 py-0.5 mx-1 rounded bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/40 font-mono text-xs font-bold shadow-rose-glow animate-pulse"
          >
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="bg-[#121217] border border-[#22222E] rounded-xl p-5 shadow-card-dark relative overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#22222E] mb-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#FF2D95]" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Live Cryptographic PII Redaction Stream
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsRedacted(!isRedacted)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
          >
            {isRedacted ? <EyeOff className="w-3.5 h-3.5 text-[#FF2D95]" /> : <Eye className="w-3.5 h-3.5 text-[#007BA7]" />}
            <span>{isRedacted ? "View Redacted Tokens" : "View Original Text"}</span>
          </button>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
            {redactions.length} IDENTIFIERS MASKED
          </span>
        </div>
      </div>

      {/* Main Animated Display */}
      <div className="min-h-[80px] text-sm font-sans leading-relaxed text-slate-200 bg-[#0A0A0A] p-4 rounded-lg border border-[#1A1A24]">
        {renderStyledTokens(isRedacted ? redactedText : originalText)}
      </div>

      {/* Redactions Badge Summary */}
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <span className="text-[11px] font-mono text-slate-400">Isolated Tokens:</span>
        {redactions.map((r, i) => (
          <span
            key={i}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181824] text-slate-300 border border-[#282838] flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D95]" />
            <span className="text-[#FF2D95] font-semibold">{r.replacement}</span>
            <span className="text-slate-500">←</span>
            <span className="line-through text-slate-400">{r.original}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
