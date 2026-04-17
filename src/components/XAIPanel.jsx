'use client';
import React from 'react';

const MetricBar = ({ label, value, colorClass, colorHex }) => {
  const textMap = {
    alpha: 'text-alpha',
    beta: 'text-beta',
    gamma: 'text-gamma',
    delta: 'text-delta'
  };

  return (
    <div className="mb-6 group">
      <div className="flex justify-between items-end mb-2">
        <span className="mono text-[10px] text-text-dim/80 tracking-wider uppercase font-bold">{label}</span>
        <span className={`mono text-sm font-bold ${textMap[colorClass]}`}>
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      <div className="h-[2px] bg-white/5 relative overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-out absolute left-0 top-0`}
          style={{
            width: `${value * 100}%`,
            backgroundColor: colorHex,
          }}
        />
      </div>
    </div>
  );
};

const XAIPanel = ({ metrics, reasoning }) => {
  return (
    <div className="hud-panel hud-corner w-full h-full flex flex-col border-white/5 bg-[#05080c]/60">
      {/* Top Telemetry Header */}
      <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-2">
        <h3 className="mono glow-text text-[10px] text-beta flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-beta animate-pulse" />
          DIAGNOSTIC_TELEMETRY
        </h3>
        <span className="mono text-[8px] text-white/20">LOG: 04.17.26</span>
      </div>

      <div className="flex-1 px-1">
        <MetricBar label="Cognitive Intensity" value={metrics?.cognitive_load || 0} colorClass="beta" colorHex="#00ff88" />
        <MetricBar label="Neural Excitement" value={metrics?.excitement || 0} colorClass="gamma" colorHex="#bc13fe" />
        <MetricBar label="Resting State" value={metrics ? (1 - metrics.cognitive_load) : 1} colorClass="alpha" colorHex="#00f2ff" />
      </div>

      {/* Reasoning Terminal Area - Enlarged for the mockup look */}
      <div className="mt-2 relative pt-6 border-t border-white/5">
        <div className="absolute top-[-8px] left-2 px-2 bg-[#05080c] mono text-[7px] text-white/30 tracking-widest">
          LOG_REASONING_TRACE
        </div>
        <div className="hud-scrollbar h-80 overflow-y-auto pr-2">
          <p className="mono text-[11px] leading-relaxed text-text-dim/90 font-medium whitespace-pre-wrap italic">
            {reasoning || ">>> STANDBY: SCANNING NEURAL ENVIRONMENT FOR SEMANTIC TRACES. READY FOR PULSE INJECTION..."}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <span className="mono text-[6px] text-white/10 uppercase">Security_Stamp: AES-NLR-09</span>
        </div>
      </div>
    </div>
  );
};

export default XAIPanel;
