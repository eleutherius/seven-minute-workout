import { useTranslation } from '../i18n.tsx';

interface TimerDisplayProps {
  seconds: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

const TimerDisplay = ({ seconds }: TimerDisplayProps) => {
  const { t } = useTranslation();

  return (
    <div className="timer">
      <span className="timer-label">{t.timeLeft}</span>
      <span className="timer-value">{formatTime(seconds)}</span>
    </div>
  );
};

export default TimerDisplay;
