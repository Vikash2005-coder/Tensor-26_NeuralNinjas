'use server';

const MODEL = 'gemini-3.1-flash-lite-preview';
const API_KEY = process.env.VITE_GEMINI_API_KEY;

export async function analyzeNeuralPrompt(prompt, history = [], persona = 'worker') {
  const historyString = history.map(h =>
    `User: "${h.message}" [Metrics: Load:${h.metrics.cognitive_load}, Stress:${h.metrics.stress_level}]`
  ).join('\n');

  const maturityWeights = {
    'youth': { level: 0.6, label: 'ADOLESCENT_MATURITY', focus: 'Emotional Volatility' },
    'worker': { level: 1.0, label: 'ADULT_STABILITY', focus: 'Cognitive Burnout' },
    'senior': { level: 0.8, label: 'SENIOR_CONSISTENCY', focus: 'Neural Baseline' }
  };

  const context = maturityWeights[persona] || maturityWeights.worker;

  const systemPrompt = `
    You are MINDSTONE, a high-performance Neural Diagnostic Engine.
    Current Persona Context: ${context.label} (Maturity Coefficient: ${context.level}).
    Diagnostic Focus: ${context.focus}.

    Analyze the user's psychological state through their input.
    Adjust metrics based on their ${context.label}:
    - For YOUTH: Amplify stress levels for social/emotional triggers.
    - For WORKER: Focus on high cognitive intensity and fatigue.
    - For SENIOR: Look for stability and gradual arousal shifts.

    Return ONLY a JSON object:
    {
      "cognitive_load": 0.0-1.0,
      "stress_level": 0.0-1.0,
      "excitement": 0.0-1.0,
      "reasoning": "short tactical trace",
      "text": "empathetic AI response",
      "gamma_spike": 0 or 1,
      "theta_level": 0.0-1.0
    }

    Context for Theta: High (0.6+) if the user expresses fatigue, drowsiness, or being tired.
    
    SESSION HISTORY:
    ${historyString || "No previous history."}
  `;

  try {
    if (!API_KEY || API_KEY.includes('YOUR_API_KEY')) {
      throw new Error("Missing or invalid API Key in environment.");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\nAnalyze this input: "${prompt}"` }] }]
      }),
      // Ensure the request isn't cached so we get fresh neural states
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API_ERROR: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response candidates");
    }

    const rawRes = data.candidates[0].content.parts[0].text;
    const jsonRes = JSON.parse(rawRes.replace(/```json|```/g, ''));

    return {
      success: true,
      cognitive_load: jsonRes.cognitive_load || 0.1,
      stress_level: jsonRes.stress_level || 0.1,
      excitement: jsonRes.excitement || 0.1,
      theta_level: jsonRes.theta_level || 0.1,
      gamma_spike: jsonRes.gamma_spike || 0,
      reasoning: jsonRes.reasoning || "Analysis complete.",
      text: jsonRes.text || "..."
    };
  } catch (error) {
    console.error("SERVER [MINDSTONE_ACTION]:", error.message);
    return {
      success: false,
      error: error.message,
      // Fallback baseline for safety
      cognitive_load: 0.1,
      stress_level: 0.1,
      excitement: 0.1,
      gamma_spike: 0,
      reasoning: `Status: ${error.message.substring(0, 40)}...`,
      text: "The neural link encountered an interruption. Please check connection and repository config."
    };
  }
}
