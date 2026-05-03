import { useTranslation } from '../i18n.tsx';

type WorkoutStatus = 'idle' | 'countdown' | 'running' | 'rest' | 'paused' | 'done';

interface ControlsProps {
  status: WorkoutStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  startDisabled?: boolean;
}

const Controls = ({ status, onStart, onPause, onReset, startDisabled }: ControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className="controls">
      <button
        className="btn primary"
        type="button"
        onClick={onStart}
        disabled={status === 'running' || status === 'countdown' || status === 'rest' || startDisabled}
      >
        {t.start}
      </button>
      <button
        className="btn"
        type="button"
        onClick={onPause}
        disabled={status !== 'running' && status !== 'countdown' && status !== 'rest'}
      >
        {t.pause}
      </button>
      <button className="btn ghost" type="button" onClick={onReset}>
        {t.reset}
      </button>
    </div>
  );
};

export default Controls;
