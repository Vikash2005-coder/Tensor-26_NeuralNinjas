'use client';
import React, { useState } from 'react';

const ChatBox = ({ onSendMessage, isProcessing }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="hud-panel hud-corner w-full border-alpha/20 p-2 shadow-[0_0_30px_rgba(0,242,255,0.05)]">
      {/* Probe Unit ID */}
      <div className="absolute -top-3 left-4 px-2 py-0.5 bg-background border border-alpha/30 mono text-[8px] text-alpha z-20">
        INPUT_PROBE_UNIT: XPR-01
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative group">
          {/* Internal status LED */}
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full z-20 transition-colors ${
            isProcessing ? 'bg-delta animate-pulse' : 'bg-beta'
          }`} />
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isProcessing ? "> RUNNING_COMPLEX_SEMANTIC_AUDIT..." : "> INJECT_NEURAL_QUERY_STRING..."}
            className="mono w-full bg-[#05080c] border border-white/5 rounded-sm text-white p-4 pr-10 outline-none focus:border-alpha/40 focus:bg-[#070b13] transition-all text-xs tracking-wider"
            disabled={isProcessing}
          />
        </div>

        <button 
          type="submit" 
          disabled={isProcessing}
          className={`px-10 rounded-sm font-bold text-black mono text-xs tracking-tighter transition-all relative overflow-hidden ${
            isProcessing 
              ? 'bg-alpha/20 cursor-wait' 
              : 'bg-alpha hover:bg-white hover:shadow-[0_0_30px_rgba(0,242,255,0.8)] cursor-pointer'
          }`}
        >
          {isProcessing ? "PROCESSING" : "PULSE"}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
