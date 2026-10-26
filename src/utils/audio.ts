/**
 * Procedural Luxury Ambient Atmosphere Generator
 * Uses Web Audio API to create a subtle, deep after-dark cinematic club drone
 * and warm vinyl harmonic warmth. No external audio files needed.
 */

class LuxuryAmbientSound {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private oscillators: OscillatorNode[] = [];
  private noiseNode: AudioNode | null = null;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.start();
      return true;
    }
  }

  public async start(): Promise<void> {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    // Master output gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.18, now + 3); // gentle 3s luxury swell
    this.masterGain.connect(this.ctx.destination);

    // Warm Low-pass Filter for intimate nocturnal luxury
    const lowPass = this.ctx.createBiquadFilter();
    lowPass.type = 'lowpass';
    lowPass.frequency.setValueAtTime(140, now);
    lowPass.Q.setValueAtTime(2.5, now);
    lowPass.connect(this.masterGain);

    // Sub-bass root drone (55Hz - A1)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, now);

    // Subtle 5th harmonic (82.4Hz - E2)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(82.41, now);

    // Octave overtone (110Hz - A2) with soft triangle warmth
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(110, now);

    const osc3Gain = this.ctx.createGain();
    osc3Gain.gain.setValueAtTime(0.15, now);
    osc3.connect(osc3Gain);
    osc3Gain.connect(lowPass);

    // LFO subtle pulsation (breathing rhythm, 0.08Hz ~ 12 seconds per cycle)
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.08, now);
    lfoGain.gain.setValueAtTime(25, now);
    lfo.connect(lfoGain);
    lfoGain.connect(lowPass.frequency);

    osc1.connect(lowPass);
    osc2.connect(lowPass);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    lfo.start(now);

    this.oscillators = [osc1, osc2, osc3, lfo];

    // Subtle vinyl/air texture
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(320, now);
      noiseFilter.Q.setValueAtTime(1.2, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.012, now);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      whiteNoise.start(now);
      this.noiseNode = whiteNoise;
    } catch {
      // Noise optional
    }

    this.isPlaying = true;
  }

  public stop(): void {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore
        }
      });
      this.oscillators = [];
      if (this.noiseNode) {
        try {
          (this.noiseNode as AudioBufferSourceNode).stop();
          this.noiseNode.disconnect();
        } catch {
          // Ignore
        }
        this.noiseNode = null;
      }
      this.isPlaying = false;
    }, 1250);
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const luxurySound = new LuxuryAmbientSound();
