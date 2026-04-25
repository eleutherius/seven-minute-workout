interface TimerDisplayProps {
  seconds: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

const TimerDisplay = ({ seconds }: TimerDisplayProps) => (
  <div className="timer">
    <span className="timer-label">Time Left</span>
    <span className="timer-value">{formatTime(seconds)}</span>
  </div>
);

export default TimerDisplay;
