import { useEffect, useMemo, useRef, useState } from 'react';
import Controls from './components/Controls.tsx';
import ExerciseIllustration from './components/ExerciseIllustration.tsx';
import ProgressBar from './components/ProgressBar.tsx';
import TimerDisplay from './components/TimerDisplay.tsx';
import exercises from './data/exercises.ts';
import type { Exercise } from './data/exercises.ts';
import { gymSplit, getTodaySplit, getTodaySplitIndex } from './data/gymWorkouts.ts';
import { useTranslation } from './i18n.tsx';
import type { Lang } from './i18n.tsx';
import { createBeepEngine, type BeepEngine } from './utils/audio.ts';

type WorkoutStatus = 'idle' | 'running' | 'paused' | 'done';
type WorkoutMode = 'home' | 'gym';

const LANGS: Record<Lang, string> = {
  en: 'English',
  uk: 'Українська',
};

const shuffle = <T,>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const savedMode = (): WorkoutMode => {
  const v = localStorage.getItem('workoutMode');
  return v === 'gym' ? 'gym' : 'home';
};

const App = () => {
  const { t, lang, setLang } = useTranslation();

  const [workoutMode, setWorkoutMode] = useState<WorkoutMode>(savedMode);

  // Home workout state
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>(() => shuffle(exercises));
  const [status, setStatus] = useState<WorkoutStatus>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(() => workoutExercises[0]?.duration ?? 0);
  const audioRef = useRef<BeepEngine | null>(null);

  // Gym checklist state
  const todaySplit = getTodaySplit();
  const todaySplitIndex = getTodaySplitIndex();
  const isGymRestDay = workoutMode === 'gym' && todaySplit.isRest;

  const makeChecklist = () =>
    Object.fromEntries(
      todaySplit.exercises.map((ex) => [ex.id, new Array(ex.sets).fill(false) as boolean[]]),
    );

  const [gymChecklist, setGymChecklist] = useState<Record<string, boolean[]>>(makeChecklist);
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSet = (exerciseId: string, setIdx: number) => {
    setGymChecklist((prev) => {
      const sets = [...(prev[exerciseId] ?? [])];
      sets[setIdx] = !sets[setIdx];
      return { ...prev, [exerciseId]: sets };
    });
  };

  // Home workout helpers
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

  const handleModeChange = (mode: WorkoutMode) => {
    localStorage.setItem('workoutMode', mode);
    setWorkoutMode(mode);
    if (mode === 'gym') {
      setGymChecklist(makeChecklist());
      setStatus('idle');
    }
  };

  useEffect(() => {
    if (status !== 'running') return undefined;
    const timerId = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [status]);

  useEffect(() => {
    if (status !== 'running' || remaining > 0) return;
    const isLast = currentIndex === workoutExercises.length - 1;
    if (isLast) {
      audioRef.current?.end();
      setStatus('done');
      return;
    }
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
          <div className="mode-switcher">
            {(['home', 'gym'] as WorkoutMode[]).map((m) => (
              <button
                key={m}
                type="button"
                className={`mode-btn${workoutMode === m ? ' active' : ''}`}
                onClick={() => handleModeChange(m)}
              >
                {m === 'home' ? t.homeMode : t.gymMode}
              </button>
            ))}
          </div>
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            {(Object.entries(LANGS) as [Lang, string][]).map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </div>
        {workoutMode === 'home' && (
          <>
            <h1>{t.appTitle}</h1>
            <div className={`status ${status}`}>{t.status[status]}</div>
          </>
        )}
      </header>

      {workoutMode === 'gym' ? (
        <>
          <section className="weekly-split">
            <p className="meta">{t.weeklySchedule}</p>
            <div className="split-calendar">
              {gymSplit.map((day, idx) => {
                const isToday = idx === todaySplitIndex;
                return (
                  <div
                    key={idx}
                    className={`split-day${isToday ? ' today' : ''}${day.isRest ? ' rest' : ''}`}
                  >
                    <span className="split-day-abbr">{t.days[idx]}</span>
                    <span className="split-day-muscle">{t.muscleGroups[day.key]}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {isGymRestDay ? (
            <section className="card rest-day-card">
              <h2>{t.restDay}</h2>
              <p className="sub">{t.restDayMessage}</p>
            </section>
          ) : (
            <>
              <div className="today-focus">
                <span className="meta">{t.todaysFocus}</span>
                <strong>{t.muscleGroups[todaySplit.key]}</strong>
              </div>

              <section className="gym-checklist">
                {todaySplit.exercises.map((ex) => {
                  const sets = gymChecklist[ex.id] ?? (new Array(ex.sets).fill(false) as boolean[]);
                  const allDone = sets.every(Boolean);
                  const expanded = expandedExercises.has(ex.id);
                  return (
                    <div key={ex.id} className={`checklist-row${allDone ? ' done' : ''}${expanded ? ' expanded' : ''}`}>
                      <div className="checklist-row-top" onClick={() => toggleExpand(ex.id)}>
                        <span className="checklist-chevron">{expanded ? '▾' : '▸'}</span>
                        <span className="checklist-name">{exerciseName(ex.id)}</span>
                        <div className="checklist-sets" onClick={(e) => e.stopPropagation()}>
                          {sets.map((checked, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className={`set-btn${checked ? ' checked' : ''}`}
                              onClick={() => toggleSet(ex.id, idx)}
                            >
                              {checked ? '✓' : idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                      {expanded && (
                        <div className="checklist-details">
                          <p className="checklist-desc">{t.exerciseDescriptions[ex.id]}</p>
                          <ExerciseIllustration motion={ex.motion} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>

              <button
                type="button"
                className="btn ghost"
                onClick={() => setGymChecklist(makeChecklist())}
              >
                {t.reset}
              </button>
            </>
          )}
        </>
      ) : (
        <>
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

          <Controls
            status={status}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />

          <section className="next">
            <p className="meta">{t.upNext}</p>
            <div className="next-card">
              <span>{nextExercise ? exerciseName(nextExercise.id) : t.cooldown}</span>
              <span>{nextExercise ? `${nextExercise.duration}${t.seconds}` : t.niceWork}</span>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default App;
