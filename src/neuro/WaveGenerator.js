/**
 * WaveGenerator synthesizes raw waveform data for rendering.
 */
export class WaveGenerator {
  constructor() {
    this.time = 0;
    this.bufferSize = 500; // Number of points to store for the visualizer
  }

  /**
   * Generates a single frame of wave data.
   * @param {Object} powers { alpha, beta, gamma, delta }
   * @param {number} deltaTime Time elapsed since last frame
   */
  generatePoint(powers, deltaTime) {
    this.time += deltaTime;

    const createWave = (freq, amp, noiseAmp) => {
      // Base sine wave
      const sine = Math.sin(this.time * freq * Math.PI * 2);
      // Add 'jitter' / broadband noise factor
      const noise = (Math.random() - 0.5) * noiseAmp;
      // Modulate by power
      return (sine + noise) * amp;
    };

    return {
      // Frequency bands with boosted visual multipliers
      alpha: createWave(10, powers.alpha * 1.5, 0.1),
      beta: createWave(22, powers.beta * 2.0, 0.5),    // Stronger beta impact
      gamma: createWave(45, powers.gamma * 2.5, 0.8),   // Very intense gamma
      delta: createWave(2, powers.delta * 1.0, 0.05),
      timestamp: this.time
    };
  }
}
