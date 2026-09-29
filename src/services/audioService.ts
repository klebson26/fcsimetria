/**
 * Web Audio API Sound Synthesizer for Exhibition Ambient Sound & UI Feedback
 */

let audioCtx: AudioContext | null = null;
let ambientOscillator1: OscillatorNode | null = null;
let ambientOscillator2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let isAmbientPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playClickSound(volume = 0.3) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (err) {
    // Silent fallback
  }
}

export function playSuccessSound(volume = 0.4) {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
    });
  } catch (err) {
    // Silent fallback
  }
}

export function toggleAmbientSound(enable: boolean, volume = 0.3): boolean {
  try {
    const ctx = getAudioContext();

    if (enable) {
      if (isAmbientPlaying) return true;

      ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(0, ctx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(volume * 0.1, ctx.currentTime + 2);

      ambientOscillator1 = ctx.createOscillator();
      ambientOscillator2 = ctx.createOscillator();

      ambientOscillator1.type = 'sine';
      ambientOscillator1.frequency.setValueAtTime(220, ctx.currentTime); // A3

      ambientOscillator2.type = 'sine';
      ambientOscillator2.frequency.setValueAtTime(329.63, ctx.currentTime); // E4 harmonic

      ambientOscillator1.connect(ambientGain);
      ambientOscillator2.connect(ambientGain);
      ambientGain.connect(ctx.destination);

      ambientOscillator1.start();
      ambientOscillator2.start();

      isAmbientPlaying = true;
      return true;
    } else {
      if (ambientGain && audioCtx) {
        ambientGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        setTimeout(() => {
          try {
            ambientOscillator1?.stop();
            ambientOscillator2?.stop();
            ambientOscillator1?.disconnect();
            ambientOscillator2?.disconnect();
          } catch (e) {}
          isAmbientPlaying = false;
        }, 500);
      }
      return false;
    }
  } catch (err) {
    return false;
  }
}

export function isAmbientSoundActive(): boolean {
  return isAmbientPlaying;
}
