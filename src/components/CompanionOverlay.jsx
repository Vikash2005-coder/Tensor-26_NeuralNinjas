'use client';
import React, { useState, useEffect } from 'react';

const CompanionOverlay = ({ onClose, persona = 'worker' }) => {
  const helplineData = {
    youth: [
      { name: 'TELE MANAS (24/7)', num: '14416' },
      { name: 'CHILDLINE (Specialized)', num: '1098' }
    ],
    senior: [
      { name: 'TELE MANAS (24/7)', num: '14416' },
      { name: 'ELDERLINE (Senior Support)', num: '14567' }
    ],
    worker: [
      { name: 'TELE MANAS (24/7)', num: '14416' },
      { name: 'KIRAN (National Helpline)', num: '1800-599-0019' }
    ]
  };

  const currentHelplines = helplineData[persona] || helplineData.worker;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-xl bg-black/60 animate-in fade-in duration-700 p-4">
      <div className="hud-panel hud-corner border-[#ff4136]/50 bg-[#0a0505]/95 max-w-sm w-full p-8 pt-10 relative overflow-visible flex flex-col items-center shadow-[0_0_40px_rgba(255,65,54,0.1)]">

        {/* Heart-Bot: Original Compact Badge */}
        <div className="absolute -top-20 -left-20 w-32 h-32 pointer-events-none z-50 drop-shadow-[0_0_15px_rgba(255,65,54,0.5)]">
          <img
            src="/images/heart-bot.png"
            alt="Heart Bot"
            className="w-48 h-48 object-contain heart-bot"
          />
        </div>

        <h2 className="mono text-2xl text-[#ff4136] glow-text mb-4 text-center tracking-tighter uppercase">
          HEART_LINK: {persona}_CARE_PROTOCOL
        </h2>

        <p className="mono text-sm text-white/80 text-center mb-8 leading-relaxed max-w-sm">
          Emotional telemetry indicates prolonged distress. System is prioritizing your wellbeing.
          <span className="block mt-4 text-[#ff4136] font-bold tracking-widest uppercase text-xs italic">
            "You are doing better than you think."
          </span>
        </p>

        {/* Dynamic Indian Helplines Section - Warm Red Theme */}
        <div className="w-full bg-red-950/20 border border-[#ff4136]/20 rounded-sm p-4 mb-8">
          <div className="mono text-[10px] text-white/40 mb-3 tracking-widest uppercase">&gt;&gt;&gt; LOCAL_EMPATHY_LINK</div>
          <div className="flex flex-col gap-3">
            {currentHelplines.map((line, idx) => (
              <div key={idx} className="flex justify-between items-center bg-black/60 p-3 border border-white/5 rounded">
                <span className="mono text-[11px] text-[#ff4136]">{line.name}</span>
                <span className="mono text-sm text-white font-bold tracking-wider">{line.num}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 w-full relative z-10">
          <button
            onClick={onClose}
            className="flex-1 bg-[#ff4136]/10 border border-[#ff4136]/40 text-[#ff4136] hover:bg-[#ff4136] hover:text-white transition-all py-3 mono text-sm font-bold tracking-widest uppercase"
          >
            I'm Feeling Better
          </button>
          <a
            href="tel:14416"
            className="flex-1 bg-white/5 border border-white/20 text-white hover:bg-white hover:text-black transition-all py-3 mono text-sm font-bold tracking-widest uppercase text-center"
          >
            Speak to Someone
          </a>
        </div>

        {/* Background Grid Pattern - Subtle Red */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#ff4136_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>
    </div>
  );
};

export default CompanionOverlay;
