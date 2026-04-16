import React from 'react';

const MetricBar = ({ label, value, color }) => (
  <div style={{ marginBottom: '15px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <span className="mono" style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{label}</span>
      <span className="mono" style={{ fontSize: '12px', color }}>{(value * 100).toFixed(0)}%</span>
    </div>
    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
      <div 
        style={{ 
          height: '100%', 
          background: color, 
          width: `${value * 100}%`,
          transition: 'width 0.5s ease-out',
          boxShadow: `0 0 10px ${color}`
        }} 
      />
    </div>
  </div>
);

const XAIPanel = ({ metrics, reasoning }) => {
  return (
    <div className="panel" style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
      <h3 className="mono glow-text" style={{ fontSize: '14px', marginBottom: '20px', color: 'var(--beta)' }}>
        NEURAL AUDIT LOG
      </h3>
      
      <div style={{ flex: 1 }}>
        <MetricBar label="COGNITIVE LOAD" value={metrics?.cognitive_load || 0} color="var(--beta)" />
        <MetricBar label="STRESS INDEX" value={metrics?.stress_level || 0} color="var(--delta)" />
        <MetricBar label="EXCITEMENT" value={metrics?.excitement || 0} color="var(--gamma)" />
        <MetricBar label="ALPHA RESIDENCE" value={1 - (metrics?.cognitive_load || 0)} color="var(--alpha)" />
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        borderTop: '1px solid var(--border-color)',
        fontSize: '12px',
        color: 'var(--text-dim)',
        lineHeight: '1.4'
      }}>
        <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '5px' }}>REASONING:</strong>
        <p className="mono">{reasoning || "System idle. Monitoring baseline oscillations..."}</p>
      </div>
    </div>
  );
};

export default XAIPanel;
