interface ExerciseIllustrationProps {
  motion?: string;
}

const ExerciseIllustration = ({ motion }: ExerciseIllustrationProps) => {
  const wrapperClass = ['illustration', motion].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass} aria-hidden="true">
      <svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle className="f-head" cx="50" cy="16" r="11" />

        {/* Torso */}
        <line className="f-torso" x1="50" y1="27" x2="50" y2="74" />

        {/* Left arm: upper arm + forearm, group rotates around shoulder (50,42) */}
        <g className="f-arm-l">
          <line x1="50" y1="42" x2="28" y2="60" />
          <line x1="28" y1="60" x2="22" y2="78" />
        </g>

        {/* Right arm: upper arm + forearm, group rotates around shoulder (50,42) */}
        <g className="f-arm-r">
          <line x1="50" y1="42" x2="72" y2="60" />
          <line x1="72" y1="60" x2="78" y2="78" />
        </g>

        {/* Left leg: thigh + shin, group rotates around left hip (47,74) */}
        <g className="f-leg-l">
          <line x1="47" y1="74" x2="36" y2="104" />
          <line x1="36" y1="104" x2="33" y2="130" />
        </g>

        {/* Right leg: thigh + shin, group rotates around right hip (53,74) */}
        <g className="f-leg-r">
          <line x1="53" y1="74" x2="64" y2="104" />
          <line x1="64" y1="104" x2="67" y2="130" />
        </g>
      </svg>
    </div>
  );
};

export default ExerciseIllustration;
