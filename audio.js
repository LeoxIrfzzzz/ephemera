/**
 * Ephemera - The Silent Network
 * Web Audio API Typewriter and Ambience Synthesizer
 */

class EphemeraAudio {
  constructor() {
    this.ctx = null;
    this.volume = 0.4;
    this.ambientVolume = 0.08;
    this.ambientNode = null;
    this.ambientGain = null;
    this.isMuted = false;
  }

  // Safely initialize the AudioContext upon user gesture
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported in this browser:", e);
    }
  }

  // Play standard keystroke click
  playKey() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    // Small random pitch variation for organic feeling
    const pitch = 380 + Math.random() * 250; 
    const duration = 0.035 + Math.random() * 0.015;
    const now = this.ctx.currentTime;

    // 1. Oscillator for transient click (metallic tick)
    const osc = this.ctx.createOscillator();
    const gainOsc = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + duration);
    
    gainOsc.gain.setValueAtTime(0.3 * this.volume, now);
    gainOsc.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gainOsc);
    gainOsc.connect(this.ctx.destination);

    // 2. White noise burst for physical key impact/spring scrape
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200 + Math.random() * 400, now);
    noiseFilter.Q.setValueAtTime(4, now);

    const gainNoise = this.ctx.createGain();
    gainNoise.gain.setValueAtTime(0.12 * this.volume, now);
    gainNoise.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);

    noise.connect(noiseFilter);
    noiseFilter.connect(gainNoise);
    gainNoise.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
    noise.start(now);
    noise.stop(now + duration);
  }

  // Play spacebar thud
  playSpace() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const duration = 0.07;
    const now = this.ctx.currentTime;

    // Deep woody thud
    const osc = this.ctx.createOscillator();
    const gainOsc = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + duration);
    
    gainOsc.gain.setValueAtTime(0.4 * this.volume, now);
    gainOsc.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gainOsc);
    gainOsc.connect(this.ctx.destination);

    // Filtered noise for air/cabinet vibration
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(250, now);

    const gainNoise = this.ctx.createGain();
    gainNoise.gain.setValueAtTime(0.2 * this.volume, now);
    gainNoise.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(noiseFilter);
    noiseFilter.connect(gainNoise);
    gainNoise.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
    noise.start(now);
    noise.stop(now + duration);
  }

  // Play delete/backspace double tick
  playBackspace() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // First key strike
    this.playKey();
    
    // Second click delayed by 50ms (mimicking trigger release sound)
    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.02);
      
      gain.gain.setValueAtTime(0.15 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    }, 50);
  }

  // Margin bell for submission (Ding!)
  playBell() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Chime resonance frequencies (metallic bell profile)
    const frequencies = [1860, 2350, 3100];
    const gains = [0.22, 0.12, 0.06];
    const decay = 1.4; // resonant decay time

    frequencies.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      // Slight pitch wobble for vintage bell character
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 6; // 6 Hz wobble
      lfoGain.gain.value = 4;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      gainNode.gain.setValueAtTime(gains[index] * this.volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      lfo.start(now);
      osc.start(now);
      
      lfo.stop(now + decay);
      osc.stop(now + decay);
    });
  }

  // Carriage Return zip & slide sound
  playCarriageReturn() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    
    // First, play the bell chime!
    this.playBell();

    // Synthesize a sequence of small mechanical ratchet clicks (accelerating ratchet)
    const clicks = 8;
    const clickDuration = 0.015;
    const interval = 0.025; // 25ms between clicks

    for (let i = 0; i < clicks; i++) {
      const clickTime = now + 0.08 + (i * interval);
      
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'triangle';
      // Pitch sweeps slightly to mimic rapid gear clicks
      osc.frequency.setValueAtTime(110 + (i * 15), clickTime);
      osc.frequency.exponentialRampToValueAtTime(30, clickTime + clickDuration);
      
      gainNode.gain.setValueAtTime(0.08 * this.volume, clickTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, clickTime + clickDuration);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start(clickTime);
      osc.stop(clickTime + clickDuration * 1.5);
    }
    
    // Play a final mechanical clunk/platen landing
    const clunkTime = now + 0.08 + (clicks * interval) + 0.03;
    const clunkOsc = this.ctx.createOscillator();
    const clunkGain = this.ctx.createGain();
    
    clunkOsc.type = 'sine';
    clunkOsc.frequency.setValueAtTime(90, clunkTime);
    clunkOsc.frequency.exponentialRampToValueAtTime(30, clunkTime + 0.06);
    
    clunkGain.gain.setValueAtTime(0.15 * this.volume, clunkTime);
    clunkGain.gain.exponentialRampToValueAtTime(0.001, clunkTime + 0.06);
    
    clunkOsc.connect(clunkGain);
    clunkGain.connect(this.ctx.destination);
    
    clunkOsc.start(clunkTime);
    clunkOsc.stop(clunkTime + 0.08);
  }


  // Play crystal glass resonance chime (Breathe Life)
  playResonance() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    
    // High crystal chime (perfect fifth dyad)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now); // E6 (harmonic Fifth)
    
    gainNode.gain.setValueAtTime(0.18 * this.volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8); // 1.8s decay

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.9);
    osc2.stop(now + 1.9);
  }

  // Toggle ambient crackle / rain / wind loops
  toggleAmbient(enable, mode = 'rain') {
    this.init();
    if (!this.ctx) return;

    // Stop current ambient sound if running
    if (this.ambientNode) {
      try {
        this.ambientNode.stop();
      } catch (e) {}
      this.ambientNode = null;
    }

    if (!enable) return;

    const sampleRate = this.ctx.sampleRate;
    const duration = 3.0; // 3 seconds loop buffer
    const bufferSize = sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Filter variables
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    // Crackle threshold depending on mode
    let crackleProb = 0.0004; // default Rain
    if (mode === 'hearth') {
      crackleProb = 0.0018; // More crackling wood pops
    } else if (mode === 'wind') {
      crackleProb = 0.00005; // Almost no crackle
    }

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      // Pink noise filter approximation
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.1; // normalize
      b6 = white * 0.115926;

      // Crackle generator (hearth pops vs rain dust)
      if (Math.random() < crackleProb) {
        // Hearth has sharper, warmer snaps
        const snapScale = mode === 'hearth' ? (Math.random() > 0.4 ? 0.45 : -0.45) : 0.3;
        data[i] += snapScale;
      }
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filter setup
    const filter = this.ctx.createBiquadFilter();
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);

    if (mode === 'wind') {
      // Wind has a whistle: bandpass filter
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.5, this.ctx.currentTime);
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      
      // Automate a low-frequency sweep to simulate wind gusts
      const now = this.ctx.currentTime;
      let timeOffset = 0;
      while (timeOffset < duration) {
        const sweepFreq = 220 + Math.random() * 400; // Whistle frequency
        const sweepDuration = 0.5 + Math.random() * 1.0;
        filter.frequency.exponentialRampToValueAtTime(sweepFreq, now + timeOffset + sweepDuration);
        timeOffset += sweepDuration;
      }
    } else if (mode === 'hearth') {
      // Hearth is warm: low cutoff lowpass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);
    } else {
      // Rain is standard lowpass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, this.ctx.currentTime);
    }

    noiseSource.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);

    noiseSource.start(0);
    this.ambientNode = noiseSource;
  }

  // Adjust volumes dynamically
  setVolume(val) {
    this.volume = val;
  }

  setAmbientVolume(val) {
    this.ambientVolume = val;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }
}

// Export sound engine globally for application script access
window.EphemeraAudio = EphemeraAudio;

