const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const ProgressBar = ({ value }) => {
  const pct = clamp(value * 100, 0, 100).toFixed(0);
  return (
    <div className="progress">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-label">{pct}%</span>
    </div>
  );
};

export default ProgressBar;
