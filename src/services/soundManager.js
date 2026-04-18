let audioCtx = null;
let masterGain = null;
let enabled = true;
let volume = 0.5;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playNote(freq, type, duration, startDelay = 0, gainVal = 0.3) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(gainVal, ctx.currentTime + startDelay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(ctx.currentTime + startDelay);
  osc.stop(ctx.currentTime + startDelay + duration + 0.05);
}

function playNoise(duration, startDelay = 0, gainVal = 0.1) {
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainVal, ctx.currentTime + startDelay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
  noise.connect(gain);
  gain.connect(masterGain);
  noise.start(ctx.currentTime + startDelay);
}

const sounds = {
  reveal() {
    // Soft ascending blip — hint unlocked
    playNote(440, 'sine', 0.12, 0, 0.08);
    playNote(554, 'sine', 0.10, 0.08, 0.06);
  },

  correct() {
    // Triumphant Bollywood-ish fanfare: C5→E5→G5→C6
    playNote(523.25, 'sine', 0.15, 0, 0.20);
    playNote(659.25, 'sine', 0.15, 0.10, 0.22);
    playNote(783.99, 'sine', 0.15, 0.20, 0.25);
    playNote(1046.5, 'sine', 0.35, 0.30, 0.30);
    playNote(1046.5, 'triangle', 0.35, 0.30, 0.12);
  },

  wrong() {
    playNote(220, 'sawtooth', 0.12, 0, 0.12);
    playNote(165, 'sawtooth', 0.20, 0.08, 0.10);
  },

  giveUp() {
    playNote(392.0, 'triangle', 0.15, 0, 0.18);
    playNote(329.6, 'triangle', 0.15, 0.12, 0.18);
    playNote(261.6, 'triangle', 0.25, 0.24, 0.18);
  },

  buttonClick() {
    playNoise(0.02, 0, 0.05);
  },

  gameStart() {
    playNote(261.6, 'sine', 0.12, 0, 0.18);
    playNote(329.6, 'sine', 0.12, 0.10, 0.18);
    playNote(392.0, 'sine', 0.18, 0.20, 0.22);
  },

  levelUp() {
    playNote(523.25, 'sine', 0.10, 0, 0.18);
    playNote(659.25, 'sine', 0.10, 0.08, 0.18);
    playNote(783.99, 'sine', 0.10, 0.16, 0.22);
    playNote(1046.5, 'sine', 0.30, 0.24, 0.28);
  },
};

export const soundManager = {
  play(name) {
    if (!enabled || !sounds[name]) return;
    try { sounds[name](); } catch { /* silent */ }
  },

  setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.value = volume;
  },

  setEnabled(val) {
    enabled = val;
  },

  isEnabled() { return enabled; },
  getVolume() { return volume; },
};
