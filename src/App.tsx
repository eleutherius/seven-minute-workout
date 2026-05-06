import { useEffect, useMemo, useRef, useState } from 'react';
import CircularTimer from './components/CircularTimer.tsx';
import Controls from './components/Controls.tsx';
import ExerciseIllustration from './components/ExerciseIllustration.tsx';
import ProgressBar from './components/ProgressBar.tsx';
import exercises from './data/exercises.ts';
import type { Exercise } from './data/exercises.ts';
import { gymSplit, getTodaySplitIndex } from './data/gymWorkouts.ts';
import { useTranslation } from './i18n.tsx';
import type { Lang } from './i18n.tsx';
import { createBeepEngine, type BeepEngine } from './utils/audio.ts';

type WorkoutStatus = 'idle' | 'countdown' | 'running' | 'rest' | 'paused' | 'done';
type WorkoutMode = 'home' | 'gym';

const COUNTDOWN_DURATION = 15;
const REST_DURATION = 10;

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
  const [pausedFrom, setPausedFrom] = useState<WorkoutStatus>('running');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(() => workoutExercises[0]?.duration ?? 0);
  const audioRef = useRef<BeepEngine | null>(null);

  // Gym checklist state
  const todaySplitIndex = getTodaySplitIndex();
  const [selectedSplitIndex, setSelectedSplitIndex] = useState(todaySplitIndex);
  const selectedSplit = gymSplit[selectedSplitIndex];
  const isGymRestDay = workoutMode === 'gym' && selectedSplit.isRest;

  const makeChecklist = (split = selectedSplit) =>
    Object.fromEntries(
      split.exercises.map((ex) => [ex.id, new Array(ex.sets).fill(false) as boolean[]]),
    );

  const [gymChecklist, setGymChecklist] = useState<Record<string, boolean[]>>(() => makeChecklist());

  const completedGymExercises = selectedSplit.exercises.filter(
    (ex) => (gymChecklist[ex.id] ?? new Array(ex.sets).fill(false) as boolean[]).every(Boolean),
  ).length;
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());

  const handleDaySelect = (idx: number) => {
    setSelectedSplitIndex(idx);
    setGymChecklist(makeChecklist(gymSplit[idx]));
    setExpandedExercises(new Set());
  };

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
      setRemaining(COUNTDOWN_DURATION);
      setStatus('countdown');
    } else if (status === 'paused') {
      setStatus(pausedFrom);
    }
  };

  const handlePause = () => {
    initAudio();
    if (status === 'running' || status === 'rest' || status === 'countdown') {
      audioRef.current?.pause();
      setPausedFrom(status);
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
    if (status !== 'running' && status !== 'countdown' && status !== 'rest') return undefined;
    const timerId = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [status]);

  useEffect(() => {
    if (remaining > 0) return;
    if (status === 'countdown') {
      setStatus('running');
      setRemaining(workoutExercises[0]?.duration ?? 0);
      return;
    }
    if (status === 'rest') {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setStatus('running');
      setRemaining(workoutExercises[nextIndex]?.duration ?? 0);
      return;
    }
    if (status === 'running') {
      const isLast = currentIndex === workoutExercises.length - 1;
      if (isLast) {
        audioRef.current?.end();
        setStatus('done');
        return;
      }
      audioRef.current?.restStart();
      setStatus('rest');
      setRemaining(REST_DURATION);
    }
  }, [remaining, status, currentIndex, workoutExercises]);

  useEffect(() => {
    if (status === 'running') {
      audioRef.current?.start();
    }
  }, [status, currentIndex]);

  // Tick sound during countdown
  useEffect(() => {
    if (status === 'countdown' && remaining > 0) {
      audioRef.current?.tick();
    }
  }, [remaining, status]);

  const displayStatus = status === 'paused' ? pausedFrom : status;

  const completedDuration = useMemo(() => {
    const finished = workoutExercises
      .slice(0, currentIndex)
      .reduce((sum, ex) => sum + ex.duration, 0);
    let currentElapsed = 0;
    if (displayStatus === 'running') {
      currentElapsed = current?.duration ? current.duration - remaining : 0;
    } else if (displayStatus === 'rest' || displayStatus === 'done') {
      currentElapsed = current?.duration ?? 0;
    }
    return finished + Math.max(0, currentElapsed);
  }, [currentIndex, remaining, current, workoutExercises, displayStatus]);

  const overallProgress = totalDuration ? completedDuration / totalDuration : 0;

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
                const isSelected = idx === selectedSplitIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDaySelect(idx)}
                    className={`split-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}${day.isRest ? ' rest' : ''}`}
                  >
                    <span className="split-day-abbr">{t.days[idx]}</span>
                    <span className="split-day-muscle">{t.muscleGroups[day.key]}</span>
                  </button>
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
                <span className="meta">{selectedSplitIndex === todaySplitIndex ? t.todaysFocus : t.days[selectedSplitIndex]}</span>
                <strong>{t.muscleGroups[selectedSplit.key]}</strong>
                <span className={`gym-exercise-counter${completedGymExercises === selectedSplit.exercises.length ? ' all-done' : ''}`}>
                  {completedGymExercises} / {selectedSplit.exercises.length}
                </span>
              </div>

              <section className="gym-checklist">
                {selectedSplit.exercises.map((ex) => {
                  const sets = gymChecklist[ex.id] ?? (new Array(ex.sets).fill(false) as boolean[]);
                  const allDone = sets.every(Boolean);
                  const expanded = expandedExercises.has(ex.id);
                  return (
                    <div key={ex.id} className={`checklist-row${allDone ? ' done' : ''}${expanded ? ' expanded' : ''}`}>
                      <div className="checklist-row-top" onClick={() => toggleExpand(ex.id)}>
                        <span className="checklist-chevron">{expanded ? '▾' : '▸'}</span>
                        <span className="checklist-name">{exerciseName(ex.id)}</span>
                        <span className="reps-badge">× {ex.reps}</span>
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
                          <img
                            className="checklist-photo"
                            src={`${import.meta.env.BASE_URL}exercises/${ex.id}.webp`}
                            alt={exerciseName(ex.id)}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
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
          {displayStatus === 'countdown' && (
            <section className="card home-card">
              <p className="home-card-label">{t.getReady}</p>
              <p className="home-card-exercise-name">
                {t.exerciseX} 1 {t.ofTotal} {workoutExercises.length} · {exerciseName(workoutExercises[0]?.id)}
              </p>
              <CircularTimer seconds={remaining} total={COUNTDOWN_DURATION} color="var(--accent-2)" />
            </section>
          )}

          {displayStatus === 'rest' && (
            <section className="card home-card">
              <p className="home-card-label">{t.restLabel}</p>
              <p className="home-card-exercise-name">
                {t.upNext} · {exerciseName(workoutExercises[currentIndex + 1]?.id)}
              </p>
              <CircularTimer seconds={remaining} total={REST_DURATION} color="var(--accent-3)" />
            </section>
          )}

          {displayStatus !== 'countdown' && displayStatus !== 'rest' && (
            <section className="card home-card">
              <p className="home-card-label">
                {t.exerciseX} {currentIndex + 1} {t.ofTotal} {workoutExercises.length}
              </p>
              <h2 className="home-card-title">{current ? exerciseName(current.id) : ''}</h2>
              <CircularTimer seconds={remaining} total={current?.duration ?? 1} />
              <ExerciseIllustration motion={current?.motion} />
            </section>
          )}

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

          {displayStatus !== 'rest' && (
            <section className="next">
              <p className="meta">{t.upNext}</p>
              <div className="next-card">
                <span>{nextExercise ? exerciseName(nextExercise.id) : t.cooldown}</span>
                <span>{nextExercise ? `${nextExercise.duration}${t.seconds}` : t.niceWork}</span>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default App;
