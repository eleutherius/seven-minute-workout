interface ExerciseIllustrationProps {
  motion?: string;
}

const ExerciseIllustration = ({ motion }: ExerciseIllustrationProps) => {
  const className = ['illustration', motion].filter(Boolean).join(' ');

  return (
    <div className={className} aria-hidden="true">
      <span className="head" />
      <span className="torso" />
      <span className="arm left" />
      <span className="arm right" />
      <span className="leg left" />
      <span className="leg right" />
    </div>
  );
};

export default ExerciseIllustration;
