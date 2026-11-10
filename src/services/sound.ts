// Procedural ambient sound engine using Web Audio API (no external MP3 dependencies)
class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentType: string | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft chime notification when Pomodoro ends
  playChime() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord
      freqs.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 1.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 1.3);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  // Ambient sound generator: Rain, White Noise, or Deep Focus Drone
  playAmbient(type: 'rain' | 'whitenoise' | 'binaural', volume = 0.2) {
    try {
      this.stopAmbient();
      this.initContext();
      if (!this.ctx) return;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);
      this.gainNode = masterGain;

      if (type === 'rain' || type === 'whitenoise') {
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Pink/Brown noise filter for rain texture
            lastOut = (lastOut + 0.02 * white) / 1.02;
            output[i] = lastOut * 3.5;
          } else {
            // White noise
            output[i] = white * 0.4;
          }
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        if (type === 'rain') {
          // Lowpass filter for cozy muffled rain sound
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, this.ctx.currentTime);
          whiteNoise.connect(filter);
          filter.connect(masterGain);
        } else {
          whiteNoise.connect(masterGain);
        }

        whiteNoise.start();
        this.currentSource = whiteNoise;
      } else if (type === 'binaural') {
        // Alpha wave drone (196Hz + 206Hz = 10Hz alpha difference for calm focus)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(196, this.ctx.currentTime);
        osc2.frequency.setValueAtTime(206, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, this.ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();
        this.currentSource = osc1; // Reference
      }

      this.isPlaying = true;
      this.currentType = type;
    } catch (e) {
      console.warn('Ambient play error:', e);
    }
  }

  setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  stopAmbient() {
    try {
      if (this.currentSource) {
        if ('stop' in this.currentSource && typeof (this.currentSource as any).stop === 'function') {
          (this.currentSource as any).stop();
        }
        this.currentSource.disconnect();
        this.currentSource = null;
      }
      this.isPlaying = false;
      this.currentType = null;
    } catch (e) {
      console.warn('Ambient stop error:', e);
    }
  }

  isCurrentlyPlaying() {
    return this.isPlaying;
  }

  getCurrentType() {
    return this.currentType;
  }
}

export const soundEngine = new SoundEngine();
