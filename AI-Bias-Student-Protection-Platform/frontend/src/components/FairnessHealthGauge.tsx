import React from 'react';

interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const FairnessHealthGauge: React.FC<Props> = ({ score, size = 160, strokeWidth = 14 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, score))) / 100;

  // Determine status color
  let strokeColor = "#007BA7"; // Cerulean
  let statusText = "COMPLIANT";
  if (score < 60) {
    strokeColor = "#FF2D95"; // Neon Rose
    statusText = "HIGH ADVERSE RISK";
  } else if (score < 75) {
    strokeColor = "#F59E0B"; // Amber
    statusText = "REVIEW REQUIRED";
  }

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-[135deg]"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E1E2A"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          fill="transparent"
        />
        {/* Animated Active Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 1.2s ease-out, stroke 0.5s ease',
            filter: `drop-shadow(0 0 8px ${strokeColor}66)`
          }}
        />
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
          {score.toFixed(1)}
        </span>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
          Health Index
        </span>
        <span
          className="text-[9px] font-mono font-bold mt-1 px-1.5 py-0.5 rounded"
          style={{
            color: strokeColor,
            backgroundColor: `${strokeColor}1A`,
            border: `1px solid ${strokeColor}4D`
          }}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
};
