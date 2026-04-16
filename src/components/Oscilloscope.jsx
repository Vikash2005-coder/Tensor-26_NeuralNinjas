'use client';
import React, { useRef, useEffect } from 'react';

const COLORS = {
  alpha: '#00f2ff', 
  beta: '#00ff88',  
  gamma: '#bc13fe', 
  theta: '#ffaa00'  
};

const Oscilloscope = ({ waveData }) => {
  const canvasRef = useRef(null);
  const dataRef = useRef([]);

  useEffect(() => {
    if (waveData) {
      dataRef.current.push(waveData);
      if (dataRef.current.length > 400) {
        dataRef.current.shift();
      }
    }
  }, [waveData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const waves = ['alpha', 'beta', 'gamma', 'theta'];
      const trackHeight = height / 4;

      waves.forEach((wave, index) => {
        ctx.beginPath();
        const color = COLORS[wave];
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;

        const centerY = (index * trackHeight) + (trackHeight / 2);
        
        // Draw track grid line (dashed secondary)
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.05)';
        ctx.setLineDash([5, 10]);
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.restore();

        // High-tech label (Large & Readable)
        ctx.font = '700 14px Space Mono, monospace';
        ctx.fillStyle = color;
        ctx.fillText(`CH_${index + 1}: ${wave.toUpperCase()}`, 15, (index * trackHeight) + 25);

        // Waveform Path
        dataRef.current.forEach((point, i) => {
          const x = (i / 400) * width;
          const y = centerY + (point[wave] * trackHeight * 0.45);
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="hud-panel hud-corner flex-1 border-alpha/10 group overflow-hidden bg-[#05080c]/80">
      {/* Background Blueprint Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 242, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 242, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <canvas 
        ref={canvasRef} 
        width={1000} 
        height={600} 
        className="w-full h-full block relative z-10"
      />
    </div>
  );
};

export default Oscilloscope;
