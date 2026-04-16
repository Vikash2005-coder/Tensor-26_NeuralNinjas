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
      theta: { power: 0.1, target: 0.1, decay: 0.06 },  // Drowsy/Meditative
    };
    
    this.baseline = {
      alpha: 0.5,
      beta: 0.2,
      gamma: 0.05,
      theta: 0.1
    };
  }

  /**
   * Pushes the system into a new state based on cognitive load analysis.
   * @param {Object} metrics { cognitive_load, stress_level, excitement, theta_level }
   */
  trigger(metrics) {
    const { cognitive_load, stress_level, excitement, gamma_spike, theta_level } = metrics;

    // 1. BETA: Driven by logic depth and stress arousal
    this.states.beta.target = 0.2 + (cognitive_load * 0.5) + (stress_level * 0.4);
    
    // 2. ALPHA: Suppressed by cognitive/emotional friction
    const friction = Math.max(cognitive_load, stress_level);
    this.states.alpha.target = Math.max(0.05, 0.7 - (friction * 0.65));
    
    // 3. GAMMA: Driven by specialized 'Insight/Novelty' spikes from the LLM
    this.states.gamma.target = 0.05 + (gamma_spike * 0.75) + (excitement * 0.2);

    // 4. THETA: Driven specifically by detected fatigue
    this.states.theta.target = 0.1 + (theta_level * 0.8);
    
    console.log("[NeuralEngine] Live LLM Neural Response:", this.states);
  }

  /**
   * Updates current powers towards targets using an asymptotic approach.
   * This implements the 'Hangover Effect' where state persists.
   */
  update() {
    for (const key in this.states) {
      const state = this.states[key];
      const diff = state.target - state.power;
      state.power += diff * state.decay;

      const baselineDiff = this.baseline[key] - state.target;
      state.target += baselineDiff * 0.005;
    }
    
    return {
      alpha: this.states.alpha.power,
      beta: this.states.beta.power,
      gamma: this.states.gamma.power,
      theta: this.states.theta.power,
    };
  }
}
