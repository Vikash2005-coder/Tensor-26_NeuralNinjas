import React, { useRef, useEffect } from 'react';

const COLORS = {
  alpha: '#00d4ff',
  beta: '#00ff41',
  gamma: '#bb86fc',
  delta: '#f48fb1'
};

const Oscilloscope = ({ waveData }) => {
  const canvasRef = useRef(null);
  const dataRef = useRef([]);

  // Data persistence for the scroll effect
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

      const waves = ['alpha', 'beta', 'gamma', 'delta'];
      const trackHeight = height / 4;

      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.strokeStyle = COLORS[wave];
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = COLORS[wave];

        const centerY = (index * trackHeight) + (trackHeight / 2);
        
        // Draw track grid line
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.restore();

        // Label
        ctx.font = '10px Roboto Mono';
        ctx.fillStyle = COLORS[wave];
        ctx.fillText(wave.toUpperCase(), 10, (index * trackHeight) + 15);

        // Draw waveform
        dataRef.current.forEach((point, i) => {
          const x = (i / 400) * width;
          const y = centerY + (point[wave] * trackHeight * 0.4);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="panel" style={{ flex: 1, padding: '10px', minHeight: '300px' }}>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
};

export default Oscilloscope;
