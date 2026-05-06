interface CircularTimerProps {
  seconds: number;
  total: number;
  color?: string;
}

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CircularTimer = ({ seconds, total, color = 'var(--accent)' }: CircularTimerProps) => {
  const progress = total > 0 ? (total - seconds) / total : 0;
  const offset = CIRCUMFERENCE * progress;

  return (
    <div className="circular-timer">
      <svg viewBox="0 0 200 200" className="circular-timer-svg">
        <circle className="circular-timer-track" cx="100" cy="100" r={RADIUS} />
        <circle
          className="circular-timer-fill"
          cx="100"
          cy="100"
          r={RADIUS}
          style={{ stroke: color, strokeDasharray: CIRCUMFERENCE, strokeDashoffset: offset }}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <span className="circular-timer-value">{seconds}</span>
    </div>
  );
};

export default CircularTimer;
