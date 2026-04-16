import React, { useState, useEffect, useRef } from 'react';
import Oscilloscope from './components/Oscilloscope';
import ChatBox from './components/ChatBox';
import XAIPanel from './components/XAIPanel';
import { NeuralEngine } from './neuro/NeuralEngine';
import { WaveGenerator } from './neuro/WaveGenerator';
import { AiService } from './services/AiService';

function App() {
  // State for UI and AI responses
  const [metrics, setMetrics] = useState(null);
  const [reasoning, setReasoning] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentWavePoint, setCurrentWavePoint] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [history, setHistory] = useState([]);

  // Persistent Engine instances
  const engineRef = useRef(new NeuralEngine());
  const generatorRef = useRef(new WaveGenerator());
  const aiServiceRef = useRef(new AiService(import.meta.env.VITE_GEMINI_API_KEY));

  // The main simulation loop: runs at 60fps to generate wave data
  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId;

    const loop = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // 1. Update the neural state (Inertia/Decay)
      const powers = engineRef.current.update();

      // 2. Generate a wave point based on those powers
      const point = generatorRef.current.generatePoint(powers, deltaTime);
      
      // 3. Push to state for rendering (we only need the latest point for the Oscilloscope)
      setCurrentWavePoint(point);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMessage = async (message) => {
    setIsProcessing(true);
    
    // 1. Analyze the prompt via AI (Passing conversion history)
    const result = await aiServiceRef.current.analyzePrompt(message, history);
    
    // 2. Update memory (keep last 5 turns)
    const newTurn = { message, response: result.text, metrics: result };
    setHistory(prev => [...prev, newTurn].slice(-5));

    // 3. Update the neural engine triggers
    engineRef.current.trigger({
      cognitive_load: result.cognitive_load,
      stress_level: result.stress_level,
      excitement: result.excitement,
      gamma_spike: result.gamma_spike
    });

    // 4. Update UI
    setMetrics(result);
    setReasoning(result.reasoning);
    setAiResponse(result.text);
    setIsProcessing(false);
  };

  return (
    <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="mono glow-text" style={{ color: 'var(--beta)', letterSpacing: '2px', fontSize: '24px' }}>
            NEURO-LINGUISTIC RESONANCE <span className="pulse">●</span>
          </h1>
          <p className="mono" style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
            BIO-SYNTHETIC STATE MONITOR // SRM-NLR-v1.0
          </p>
        </div>
        <div className="panel mono" style={{ padding: '10px 20px', fontSize: '12px' }}>
          SYSTEM STATUS: <span style={{ color: 'var(--beta)' }}>OPTIMAL</span>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', gap: '20px', minHeight: 0 }}>
        {/* Main Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          {/* Main Visualizer - Takes the most space */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <Oscilloscope waveData={currentWavePoint} />
          </div>
          
          {/* Chat and Response Area - Fixed Heights */}
          <div className="panel" style={{ height: '120px', position: 'relative', overflowY: 'auto' }}>
             <p className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '10px' }}>AI RESPONSE STREAM:</p>
             <p style={{ fontSize: '14px', lineHeight: '1.4' }}>{aiResponse || "Awaiting neural input..."}</p>
          </div>

          <ChatBox onSendMessage={handleMessage} isProcessing={isProcessing} />
        </div>

        {/* Sidebar Diagnostics */}
        <div style={{ width: '300px', display: 'flex' }}>
          <XAIPanel metrics={metrics} reasoning={reasoning} />
        </div>
      </main>

      <footer className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center' }}>
        &copy; 2026 NERUAL RESONANCE LABS // SECURE QUANTUM LINK ACTIVE
      </footer>
    </div>
  );
}

export default App;
