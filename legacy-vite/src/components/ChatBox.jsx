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
    <div className="panel" style={{ marginTop: '20px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isProcessing ? "Analyzing Neural Resonance..." : "Enter neural probe query..."}
          className="mono"
          disabled={isProcessing}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            color: 'white',
            padding: '12px',
            outline: 'none'
          }}
        />
        <button 
          type="submit" 
          disabled={isProcessing}
          style={{
            background: 'var(--beta)',
            border: 'none',
            borderRadius: '4px',
            padding: '0 20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: 'black',
            opacity: isProcessing ? 0.5 : 1
          }}
        >
          PULSE
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
