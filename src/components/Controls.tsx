type WorkoutStatus = 'idle' | 'running' | 'paused' | 'done';

interface ControlsProps {
  status: WorkoutStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const Controls = ({ status, onStart, onPause, onReset }: ControlsProps) => (
  <div className="controls">
    <button
      className="btn primary"
      type="button"
      onClick={onStart}
      disabled={status === 'running'}
    >
      Start
    </button>
    <button
      className="btn"
      type="button"
      onClick={onPause}
      disabled={status !== 'running'}
    >
      Pause
    </button>
    <button className="btn ghost" type="button" onClick={onReset}>
      Reset
    </button>
  </div>
);

export default Controls;
