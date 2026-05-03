export interface BeepEngine {
  start: () => void;
  end: () => void;
  pause: () => void;
  tick: () => void;
  restStart: () => void;
}

export const createBeepEngine = (): BeepEngine | null => {
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  const context = new AudioContextClass();

  // Tracks gain nodes of the currently fading gong so we can cut them on restart
  const activeGongGains: GainNode[] = [];

  const resume = () => {
    if (context.state === 'suspended') context.resume();
  };

  const stopGong = () => {
    const now = context.currentTime;
    for (const g of activeGongGains) {
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.linearRampToValueAtTime(0, now + 0.03);
    }
    activeGongGains.length = 0;
  };

  const beep = (frequency: number, duration: number, type: OscillatorType, gainValue: number) => {
    resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = gainValue;

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  };

  // Gong: multiple inharmonic partials with exponential decay
  const gong = () => {
    resume();
    stopGong();

    const now = context.currentTime;
    const decayTime = 2.8;

    const partials: [number, number][] = [
      [110, 0.22],
      [180, 0.14],
      [275, 0.09],
      [420, 0.06],
      [610, 0.04],
    ];

    for (const [freq, amp] of partials) {
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      osc.connect(gain);
      gain.connect(context.destination);

      osc.start(now);
      osc.stop(now + decayTime);

      activeGongGains.push(gain);
    }
  };

  return {
    start: gong,
    end: () => beep(220, 0.24, 'triangle', 0.2),
    pause: () => beep(330, 0.1, 'sine', 0.12),
    tick: () => beep(880, 0.08, 'sine', 0.12),
    restStart: () => beep(528, 0.15, 'sine', 0.1),
  };
};
