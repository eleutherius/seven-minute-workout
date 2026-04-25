import { useEffect, useMemo, useRef, useState } from 'react';
import Controls from './components/Controls.tsx';
import ExerciseIllustration from './components/ExerciseIllustration.tsx';
import ProgressBar from './components/ProgressBar.tsx';
import TimerDisplay from './components/TimerDisplay.tsx';
import exercises from './data/exercises.ts';
import type { Exercise } from './data/exercises.ts';
import { useTranslation } from './i18n.tsx';
import type { Lang } from './i18n.tsx';
import { createBeepEngine, type BeepEngine } from './utils/audio.ts';

type WorkoutStatus = 'idle' | 'running' | 'paused' | 'done';

const LANGS: Lang[] = ['en', 'uk'];

const shuffle = <T,>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const App = () => {
  const { t, lang, setLang } = useTranslation();

  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>(() => shuffle(exercises));
  const [status, setStatus] = useState<WorkoutStatus>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(() => workoutExercises[0]?.duration ?? 0);
  const audioRef = useRef<BeepEngine | null>(null);

  const current = workoutExercises[currentIndex];
  const nextExercise = workoutExercises[currentIndex + 1];

  const totalDuration = useMemo(
    () => workoutExercises.reduce((sum, ex) => sum + ex.duration, 0),
    [workoutExercises],
  );

  const initAudio = () => {
    if (!audioRef.current) {
      audioRef.current = createBeepEngine();
    }
  };

  const handleStart = () => {
    initAudio();
    if (status === 'idle' || status === 'done') {
      const next = shuffle(exercises);
      setWorkoutExercises(next);
      setCurrentIndex(0);
      setRemaining(next[0]?.duration ?? 0);
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
    const next = shuffle(exercises);
    setWorkoutExercises(next);
    setStatus('idle');
    setCurrentIndex(0);
    setRemaining(next[0]?.duration ?? 0);
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

    const isLast = currentIndex === workoutExercises.length - 1;
    if (isLast) {
      audioRef.current?.end();
      setStatus('done');
      return;
    }

    audioRef.current?.transition();
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setRemaining(workoutExercises[nextIndex].duration);
  }, [remaining, status, currentIndex, workoutExercises]);

  useEffect(() => {
    if (status === 'running') {
      audioRef.current?.start();
    }
  }, [status, currentIndex]);

  const completedDuration = useMemo(() => {
    const finished = workoutExercises
      .slice(0, currentIndex)
      .reduce((sum, ex) => sum + ex.duration, 0);
    const currentElapsed = current?.duration ? current.duration - remaining : 0;
    return finished + Math.max(0, currentElapsed);
  }, [currentIndex, remaining, current, workoutExercises]);

  const overallProgress = totalDuration ? completedDuration / totalDuration : 0;
  const exerciseProgress = current?.duration
    ? (current.duration - remaining) / current.duration
    : 0;

  const exerciseName = (id: string) => t.exercises[id] ?? id;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <p className="eyebrow">{t.appSubtitle}</p>
          <div className="lang-switcher">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                className={`lang-btn${lang === l ? ' active' : ''}`}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <h1>{t.appTitle}</h1>
        <div className={`status ${status}`}>{t.status[status]}</div>
      </header>

      <section className="card">
        <div className="card-top">
          <div className="exercise-meta">
            <p className="meta">
              {t.exerciseX} {currentIndex + 1} {t.ofTotal} {workoutExercises.length}
            </p>
            <h2>{current ? exerciseName(current.id) : ''}</h2>
            <p className="sub">{current?.duration}{t.seconds}</p>
          </div>
          <ExerciseIllustration motion={current?.motion} />
        </div>

        <TimerDisplay seconds={remaining} />
        <ProgressBar value={exerciseProgress} />
      </section>

      <section className="overall">
        <div className="overall-header">
          <span>{t.overallProgress}</span>
          <span>{Math.round(overallProgress * 100)}%</span>
        </div>
        <ProgressBar value={overallProgress} />
      </section>

      <Controls status={status} onStart={handleStart} onPause={handlePause} onReset={handleReset} />

      <section className="next">
        <p className="meta">{t.upNext}</p>
        <div className="next-card">
          <span>{nextExercise ? exerciseName(nextExercise.id) : t.cooldown}</span>
          <span>{nextExercise ? `${nextExercise.duration}${t.seconds}` : t.niceWork}</span>
        </div>
      </section>
    </div>
  );
};

export default App;
