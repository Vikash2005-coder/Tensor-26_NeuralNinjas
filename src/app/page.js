'use client';

import React, { useState, useEffect, useRef } from 'react';
import Oscilloscope from '@/components/Oscilloscope';
import ChatBox from '@/components/ChatBox';
import XAIPanel from '@/components/XAIPanel';
import RadialGauge from '@/components/RadialGauge';
import { NeuralEngine } from '@/lib/neuro/NeuralEngine';
import { WaveGenerator } from '@/lib/neuro/WaveGenerator';
import { analyzeNeuralPrompt } from './actions';

export default function Home() {
  const [metrics, setMetrics] = useState(null);
  const [reasoning, setReasoning] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentWavePoint, setCurrentWavePoint] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [showComms, setShowComms] = useState(false);
  const [isActive, setIsActive] = useState(false); // Standby interlock
  const [history, setHistory] = useState([]);

  const engineRef = useRef(null);
  const generatorRef = useRef(null);

  useEffect(() => {
    engineRef.current = new NeuralEngine();
    generatorRef.current = new WaveGenerator();
  }, []);

  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId;

    const loop = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isActive && engineRef.current && generatorRef.current) {
        const powers = engineRef.current.update();
        const point = generatorRef.current.generatePoint(powers, deltaTime);
        setCurrentWavePoint(point);
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive]);

  const handleMessage = async (message) => {
    setIsActive(true); // Bring systems online on first pulse
    setIsProcessing(true);
    try {
      const result = await analyzeNeuralPrompt(message, history);
      const newTurn = { message, response: result.text, metrics: result };
      setHistory(prev => [...prev, newTurn].slice(-5));
      if (engineRef.current) {
        engineRef.current.trigger({
          cognitive_load: result.cognitive_load,
          stress_level: result.stress_level,
          excitement: result.excitement,
          gamma_spike: result.gamma_spike,
          theta_level: result.theta_level // Connection restored here
        });
      }
      setMetrics(result);
      setReasoning(result.reasoning);
      setAiResponse(result.text);
      setShowComms(true);
    } catch (err) {
      setReasoning("Fatal connectivity loss: Neural link offline.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative h-screen bg-[#03050a] text-foreground p-3 flex flex-col gap-3 overflow-hidden">
      <div className="scanning-line" />

      {/* TOP STATUS BAR */}
      <header className="z-20 flex justify-between items-start">
        <div className="hud-panel hud-corner border-alpha/30 py-1.5 px-6">
          <h1 className="mono glow-text text-xl text-alpha flex items-center gap-3">
            <span className="text-[9px] text-white/30 font-normal uppercase">Projection:</span> 
            NEURAL_HUD_V2.0
          </h1>
        </div>

        <div className="hud-panel hud-corner border-beta/30 py-1.5 px-6">
          <p className="mono text-[10px] text-beta pulse-medical font-bold tracking-widest uppercase">
            System_Integrity: Optimal // 0.003ms
          </p>
        </div>
      </header>

      {/* TRI-PANEL MAIN AREA */}
      <main className="z-10 flex-1 flex gap-3 min-h-0">
        {/* PANEL 1: WAVE MONITOR - Now Full Height After Comms Removal */}
        <section className="flex-[5] flex flex-col min-w-0 h-full">
          <div className="flex-1 relative group hud-panel hud-corner border-white/5 bg-[#05080c]/80 overflow-hidden">
            <div className="absolute top-3 right-4 text-[7px] mono text-white/20 z-20 pointer-events-none tracking-widest uppercase">
              RLT_SYNC: LIVE_FEED_01
            </div>
            <Oscilloscope waveData={currentWavePoint} />
          </div>
        </section>

        {/* PANEL 2: DIAGNOSTIC TELEMETRY */}
        <aside className="flex-[3] flex h-full">
          <XAIPanel metrics={metrics} reasoning={reasoning} />
        </aside>

        {/* PANEL 3: STRESS INDEX POD */}
        <aside className="flex-[2] hud-panel hud-corner border-white/5 bg-[#05080c]/60 h-full relative overflow-hidden">
           <RadialGauge value={metrics?.stress_level || 0.1} />
        </aside>
      </main>

      {/* INTERACTIVE FOOTER LAYERS */}
      <footer className="z-20 flex flex-col gap-1.5 relative pb-0">
        
        <div className="w-full flex justify-between items-end px-4 gap-6 min-h-[100px]">
           {/* LEFT COLUMN: TACTICAL COMMS (Occupying original input space) */}
           <div className="flex-1 max-w-xl">
              {showComms && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="hud-panel hud-corner border-alpha/80 bg-background/95 p-4 relative">
                      <button 
                        onClick={() => setShowComms(false)}
                        className="absolute top-2 right-2 text-alpha hover:text-delta transition-colors mono text-xs p-1"
                        aria-label="Close Neural Link"
                      >
                        [X]
                      </button>
                      <div className="mono text-[8px] text-alpha/40 mb-2 tracking-widest uppercase">&gt;&gt;&gt; INCOMING_NEURAL_LINK</div>
                      <p className="mono text-[11px] leading-relaxed text-white pr-4">
                        <span className="text-alpha font-bold mr-2 uppercase text-[9px]">Comms:</span>
                        {aiResponse || ">>> ESTABLISHING STABLE QUANTUM NEURAL UPLINK..."}
                      </p>
                  </div>
                </div>
              )}
           </div>

           {/* RIGHT COLUMN: NEURAL PROBE INPUT (Right Justified) */}
           <div className="w-full max-w-2xl">
              <ChatBox onSendMessage={handleMessage} isProcessing={isProcessing} />
           </div>
        </div>

        {/* BRANDING FOOTER */}
        <div className="w-full flex justify-between items-end px-4">
           {/* Logo Area */}
           <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mono text-lg text-white/40 hover:border-alpha hover:text-white transition-all cursor-help">
                  N
               </div>
               <div className="mono text-[8px] text-white/20 uppercase tracking-[2px]">
                   Encryption: AES-256-GCM // Neural_Link_Node: IN-SRM-05
               </div>
           </div>

           <div className="mono text-[8px] text-white/20 uppercase tracking-[2px] text-right">
                Scan_Range: 4096.0Hz // REFRESH: 60FPS // APP_ROUTER: ACTIVE
           </div>
        </div>
      </footer>

    </div>
  );
}
