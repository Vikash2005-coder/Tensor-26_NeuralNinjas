/**
 * AiService handles communication with the LLM and processes responses 
 * into neural impulse metrics.
 */
export class AiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.model = 'gemini-3.1-flash-lite-preview';
  }

  /**
   * Analyzes a prompt with conversational history to maintain neural state.
   * @param {string} prompt Current user input
   * @param {Array} history Array of previous turns [{message, response, metrics}]
   */
  async analyzePrompt(prompt, history = []) {
    const historyString = history.map(h => 
      `User: "${h.message}" [Metrics: Load:${h.metrics.cognitive_load}, Stress:${h.metrics.stress_level}]`
    ).join('\n');

    const systemPrompt = `
      You are a Neuro-Psychological Data Processor monitoring a continuous human session.
      
      ANALYSIS RULES:
      1. Map input to: cognitive_load, stress_level, excitement, and gamma_drive (0.0 - 1.0).
      2. PERSISTENCE (The Hangover): Human neural states do not reset instantly. 
         If history shows high stress/load, the current metrics should remain elevated (decaying by ~30% per turn) unless the user is noticeably calming down.
      3. Respond to the user naturally in the 'text' field.
      
      SESSION HISTORY:
      ${historyString || "No previous history."}

      Output ONLY a JSON object:
      {
        "cognitive_load": float,
        "stress_level": float,
        "excitement": float,
        "gamma_drive": float, 
        "reasoning": "Diagnostic explanation of current state + lingering effects.",
        "text": "Your helpful AI response."
      }
    `;

    try {
      if (!this.apiKey || this.apiKey.includes('YOUR_API_KEY')) {
        return this.simulateAnalysis(prompt);
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nAnalyze this input: "${prompt}"` }] }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API_ERROR: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response candidates (Check safety filters/prompt)");
      }

      const rawRes = data.candidates[0].content.parts[0].text;
      const jsonRes = JSON.parse(rawRes.replace(/```json|```/g, ''));
      
      return {
        cognitive_load: jsonRes.cognitive_load || 0.1,
        stress_level: jsonRes.stress_level || 0.1,
        excitement: jsonRes.excitement || 0.1,
        gamma_spike: jsonRes.gamma_drive || 0,
        reasoning: jsonRes.reasoning || "Analysis complete.",
        text: jsonRes.text || "..."
      };
    } catch (error) {
      console.error("DEBUG [AiService]:", error.message);
      return this.simulateAnalysis(prompt, true, error.message);
    }
  }

  simulateAnalysis(prompt, isError = false, errorMsg = "") {
    return {
      cognitive_load: 0.1,
      stress_level: 0.1,
      excitement: 0.1,
      gamma_spike: 0,
      reasoning: isError ? `Error: ${errorMsg.substring(0, 30)}...` : "Waiting for API Key validation...",
      text: isError ? "The neural link encountered an error. Check browser console for details." : "System is in safety-baseline mode."
    };
  }
}
