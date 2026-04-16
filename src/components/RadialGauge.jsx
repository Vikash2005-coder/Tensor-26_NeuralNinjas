'use client';
import React from 'react';

const RadialGauge = ({ value }) => {
  // Normalize value to 0-100
  const percentage = Math.round((value || 0) * 100);
  
  // SVG Properties
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Dynamic Color Logic: Yellow -> Orange -> Red
  const getColor = (pct) => {
    if (pct < 35) return '#ffcc00'; // Yellow (Resting/Mild)
    if (pct < 70) return '#ff6600'; // Orange (Elevated)
    return '#ff0033';              // Red (Critical Stress)
  };

  const currentColor = getColor(percentage);

  return (
    <div className="flex flex-col items-center justify-center relative w-full h-full">
      <div className="absolute top-2 left-4 mono text-[10px] text-white/30">
        NEURAL LOAD
      </div>

      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background Track */}
          <circle
            stroke="rgba(255, 255, 255, 0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Active Progress */}
          <circle
            stroke={currentColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ 
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.4s ease-in-out',
              filter: `drop-shadow(0 0 10px ${currentColor})`
            }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text (Value only) */}
        <div className="absolute flex flex-col items-center justify-center pt-1">
            <div className="flex items-end">
                <span className="mono text-4xl font-bold text-white glow-text leading-none">{percentage}</span>
                <span className="mono text-xs mb-1 ml-0.5" style={{ color: currentColor }}>%</span>
            </div>
        </div>
      </div>

      {/* Label Moved Below the Gauge */}
      <div className="mono text-[10px] mt-2 tracking-[3px] uppercase transition-colors" style={{ color: currentColor }}>STRESS INDEX</div>

      {/* Decorative pulse point */}
      <div className="absolute bottom-6 right-6 w-1 h-1 rounded-full animate-pulse transition-colors" style={{ backgroundColor: currentColor, boxShadow: `0 0 8px ${currentColor}` }} />
    </div>
  );
};

export default RadialGauge;
