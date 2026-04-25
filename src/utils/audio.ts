export interface BeepEngine {
  start: () => void;
  end: () => void;
  transition: () => void;
  pause: () => void;
}

export const createBeepEngine = (): BeepEngine | null => {
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  const context = new AudioContextClass();

  const resume = () => {
    if (context.state === 'suspended') context.resume();
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
    const now = context.currentTime;
    const decayTime = 2.8;

    // Fundamental + inharmonic overtones characteristic of a gong
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

      // Sharp attack, long exponential decay
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      osc.connect(gain);
      gain.connect(context.destination);

      osc.start(now);
      osc.stop(now + decayTime);
    }
  };

  return {
    start: gong,
    end: () => beep(220, 0.24, 'triangle', 0.2),
    transition: () => beep(520, 0.09, 'square', 0.12),
    pause: () => beep(330, 0.1, 'sine', 0.12),
  };
};
