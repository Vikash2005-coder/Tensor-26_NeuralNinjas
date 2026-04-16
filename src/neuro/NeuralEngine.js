/**
 * NeuralEngine manages the 'physiological' state of the simulation.
 * It tracks 4 wave bands and handles transitions with inertia (Hangover Effect).
 */
export class NeuralEngine {
  constructor() {
    this.states = {
      alpha: { power: 0.5, target: 0.5, decay: 0.05 },  // Relaxed baseline
      beta: { power: 0.2, target: 0.2, decay: 0.08 },   // Active thinking
      gamma: { power: 0.05, target: 0.05, decay: 0.1 }, // High processing
      delta: { power: 0.3, target: 0.3, decay: 0.03 },  // Background rest
    };
    
    this.baseline = {
      alpha: 0.5,
      beta: 0.2,
      gamma: 0.05,
      delta: 0.3
    };
  }

  /**
   * Pushes the system into a new state based on cognitive load analysis.
   * @param {Object} metrics { cognitive_load, stress_level, excitement }
   */
  trigger(metrics) {
    const { cognitive_load, stress_level, excitement, gamma_spike } = metrics;

    // 1. BETA: Driven by logic depth and stress arousal
    this.states.beta.target = 0.2 + (cognitive_load * 0.5) + (stress_level * 0.4);
    
    // 2. ALPHA: Suppressed by cognitive/emotional friction
    const friction = Math.max(cognitive_load, stress_level);
    this.states.alpha.target = Math.max(0.05, 0.7 - (friction * 0.65));
    
    // 3. GAMMA: Driven by specialized 'Insight/Novelty' spikes from the LLM
    this.states.gamma.target = 0.05 + (gamma_spike * 0.75) + (excitement * 0.2);
    
    // 4. DELTA: Suppressed by high arousal
    this.states.delta.target = Math.max(0.1, 0.4 - (stress_level * 0.3));
    
    console.log("[NeuralEngine] Live LLM Neural Response:", this.states);
  }

  /**
   * Updates current powers towards targets using an asymptotic approach.
   * This implements the 'Hangover Effect' where state persists.
   */
  update() {
    for (const key in this.states) {
      const state = this.states[key];
      // Move power towards target. 
      // The lower the decay coefficient, the longer the 'hangover'.
      const diff = state.target - state.power;
      state.power += diff * state.decay;

      // Slowly pull target back to baseline if it was pushed high
      const baselineDiff = this.baseline[key] - state.target;
      state.target += baselineDiff * 0.005; // Very slow recovery to baseline
    }
    
    return {
      alpha: this.states.alpha.power,
      beta: this.states.beta.power,
      gamma: this.states.gamma.power,
      delta: this.states.delta.power,
    };
  }
}
