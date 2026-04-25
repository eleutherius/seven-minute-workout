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

  const beep = (frequency: number, duration: number, type: OscillatorType, gainValue: number) => {
    if (context.state === 'suspended') {
      context.resume();
    }

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

  return {
    start: () => beep(880, 0.12, 'sine', 0.18),
    end: () => beep(220, 0.24, 'triangle', 0.2),
    transition: () => beep(520, 0.09, 'square', 0.12),
    pause: () => beep(330, 0.1, 'sine', 0.12),
  };
};
