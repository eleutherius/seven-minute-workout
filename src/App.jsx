import { useEffect, useMemo, useRef, useState } from 'react';
import Controls from './components/Controls.jsx';
import ExerciseIllustration from './components/ExerciseIllustration.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import TimerDisplay from './components/TimerDisplay.jsx';
import exercises from './data/exercises.js';
import { createBeepEngine } from './utils/audio.js';

const totalDuration = exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
const statusLabels = {
  idle: 'Ready',
  running: 'In Progress',
  paused: 'Paused',
  done: 'Complete'
};

const App = () => {
  const [status, setStatus] = useState('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(exercises[0]?.duration ?? 0);
  const audioRef = useRef(null);

  const current = exercises[currentIndex];
  const nextExercise = exercises[currentIndex + 1];

  const initAudio = () => {
    if (!audioRef.current) {
      audioRef.current = createBeepEngine();
    }
  };

  const handleStart = () => {
    initAudio();
    if (status === 'done') {
      setCurrentIndex(0);
      setRemaining(exercises[0]?.duration ?? 0);
    }
    setStatus('running');
  };

  const handlePause = () => {
    initAudio();
    if (status === 'running') {
      audioRef.current?.pause();
      setStatus('paused');
    }
  };

  const handleReset = () => {
    initAudio();
    setStatus('idle');
    setCurrentIndex(0);
    setRemaining(exercises[0]?.duration ?? 0);
  };

  useEffect(() => {
    if (status !== 'running') {
      return undefined;
    }

    const timerId = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [status]);

  useEffect(() => {
    if (status !== 'running' || remaining > 0) {
      return;
    }

    const isLast = currentIndex === exercises.length - 1;
    if (isLast) {
      audioRef.current?.end();
      setStatus('done');
      return;
    }

    audioRef.current?.transition();
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setRemaining(exercises[nextIndex].duration);
  }, [remaining, status, currentIndex]);

  useEffect(() => {
    if (status === 'running') {
      audioRef.current?.start();
    }
  }, [status, currentIndex]);

  const completedDuration = useMemo(() => {
    const finished = exercises
      .slice(0, currentIndex)
      .reduce((sum, exercise) => sum + exercise.duration, 0);
    const currentElapsed = current?.duration ? current.duration - remaining : 0;
    return finished + Math.max(0, currentElapsed);
  }, [currentIndex, remaining, current]);

  const overallProgress = totalDuration ? completedDuration / totalDuration : 0;
  const exerciseProgress = current?.duration
    ? (current.duration - remaining) / current.duration
    : 0;

  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">Daily 7-minute flow</p>
        <h1>Seven-Minute Workout</h1>
        <div className={`status ${status}`}>{statusLabels[status]}</div>
      </header>

      <section className="card">
        <div className="card-top">
          <div className="exercise-meta">
            <p className="meta">Exercise {currentIndex + 1} of {exercises.length}</p>
            <h2>{current?.name}</h2>
            <p className="sub">{current?.duration}s</p>
          </div>
          <ExerciseIllustration motion={current?.motion} />
        </div>

        <TimerDisplay seconds={remaining} />
        <ProgressBar value={exerciseProgress} />
      </section>

      <section className="overall">
        <div className="overall-header">
          <span>Overall Progress</span>
          <span>{Math.round(overallProgress * 100)}%</span>
        </div>
        <ProgressBar value={overallProgress} />
      </section>

      <Controls status={status} onStart={handleStart} onPause={handlePause} onReset={handleReset} />

      <section className="next">
        <p className="meta">Up next</p>
        <div className="next-card">
          <span>{nextExercise ? nextExercise.name : 'Cooldown'}</span>
          <span>{nextExercise ? `${nextExercise.duration}s` : 'Nice work!'}</span>
        </div>
      </section>
    </div>
  );
};

export default App;
