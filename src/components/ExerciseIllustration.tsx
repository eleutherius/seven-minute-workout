import Lottie from 'lottie-react';
import jumpingJacksData from '../assets/animations/jumping-jacks.json';
import lungesData from '../assets/animations/jumps.json';
import wallSitData from '../assets/animations/wall-sit.json';
import pushUpsData from '../assets/animations/push-ups.json';
import crunchesData from '../assets/animations/crunches.json';
import stepUpData from '../assets/animations/step-up.json';
import squatsData from '../assets/animations/squats.json';
import tricepsDipData from '../assets/animations/triceps-dip.json';
import plankData from '../assets/animations/plank.json';
import highKneesData from '../assets/animations/high-knees.json';
import pushupRotationData from '../assets/animations/pushup-rotation.json';
import sidePlankData from '../assets/animations/side-plank.json';

interface ExerciseIllustrationProps {
  motion?: string;
}

const MOTION_ANIMATIONS: Record<string, unknown> = {
  'motion-jump':   jumpingJacksData,
  'motion-lunge':  lungesData,
  'motion-wall':   wallSitData,
  'motion-push':   pushUpsData,
  'motion-crunch': crunchesData,
  'motion-step':   stepUpData,
  'motion-squat':  squatsData,
  'motion-dip':    tricepsDipData,
  'motion-plank':  plankData,
  'motion-run':    highKneesData,
  'motion-rotate': pushupRotationData,
  'motion-side':   sidePlankData,
};

const ExerciseIllustration = ({ motion }: ExerciseIllustrationProps) => {
  if (motion && MOTION_ANIMATIONS[motion]) {
    return (
      <div className="illustration" aria-hidden="true">
        <Lottie animationData={MOTION_ANIMATIONS[motion]} loop={true} style={{ width: 180, height: 180 }} />
      </div>
    );
  }

  return (
    <div className="illustration" aria-hidden="true">
      <svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">

        {/* Shirt body — wide trapezoid, behind everything */}
        <polygon className="f-shirt" points="28,32 72,32 63,72 37,72" />

        {/* Shoulder straps — visible beside arms */}
        <rect className="f-shirt" x="29" y="30" width="10" height="18" rx="3" />
        <rect className="f-shirt" x="61" y="30" width="10" height="18" rx="3" />

        {/* V-neck — skin triangle creates neckline */}
        <polygon className="f-vneck" points="42,32 50,47 58,32" />

        {/* Left leg: thigh + shin, group rotates around left hip (47,74) */}
        <g className="f-leg-l">
          <line x1="47" y1="74" x2="36" y2="104" strokeWidth="13" />
          <line x1="36" y1="104" x2="33" y2="128" strokeWidth="11" />
          <circle className="f-joint" cx="36" cy="104" r="7" />
          <ellipse className="f-shoe" cx="29" cy="132" rx="10" ry="5" />
        </g>

        {/* Right leg: thigh + shin, group rotates around right hip (53,74) */}
        <g className="f-leg-r">
          <line x1="53" y1="74" x2="64" y2="104" strokeWidth="13" />
          <line x1="64" y1="104" x2="67" y2="128" strokeWidth="11" />
          <circle className="f-joint" cx="64" cy="104" r="7" />
          <ellipse className="f-shoe" cx="71" cy="132" rx="10" ry="5" />
        </g>

        {/* Shorts — rendered AFTER legs so they cover the upper thigh area */}
        <rect className="f-shorts" x="36" y="68" width="28" height="24" rx="3" />

        {/* Left arm: upper arm + forearm, group rotates around shoulder (50,42) */}
        <g className="f-arm-l">
          <line x1="50" y1="42" x2="28" y2="60" strokeWidth="12" />
          <line x1="28" y1="60" x2="12" y2="72" strokeWidth="10" />
          <circle className="f-joint" cx="28" cy="60" r="6" />
        </g>

        {/* Right arm: upper arm + forearm, group rotates around shoulder (50,42) */}
        <g className="f-arm-r">
          <line x1="50" y1="42" x2="72" y2="60" strokeWidth="12" />
          <line x1="72" y1="60" x2="88" y2="72" strokeWidth="10" />
          <circle className="f-joint" cx="72" cy="60" r="6" />
        </g>

        {/* Shirt front — narrow strip rendered after arms, always visible on chest */}
        <polygon className="f-shirt" points="43,48 57,48 55,68 45,68" />

        {/* Neck */}
        <rect className="f-neck" x="46" y="26" width="8" height="8" rx="3" />

        {/* Face */}
        <circle className="f-head" cx="50" cy="16" r="11" />

        {/* Hair */}
        <ellipse className="f-hair" cx="50" cy="9" rx="11" ry="7" />

      </svg>
    </div>
  );
};

export default ExerciseIllustration;
