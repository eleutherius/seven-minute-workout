import type { Exercise } from './exercises.ts';

export interface GymExerciseTemplate {
  id: string;
  sets: number;
  setDuration: number;
  restDuration: number;
  exerciseRestDuration: number;
  motion: string;
}

export interface SplitDay {
  key: string;
  isRest: boolean;
  exercises: GymExerciseTemplate[];
}

export const GYM_REST_ID = 'gym-rest';

// Monday → Sunday
export const gymSplit: SplitDay[] = [
  {
    key: 'legs',
    isRest: false,
    exercises: [
      { id: 'gym-barbell-squat',     sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-squat' },
      { id: 'gym-leg-press',         sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-squat' },
      { id: 'gym-romanian-deadlift', sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-lunge' },
      { id: 'gym-leg-curl',          sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-plank' },
      { id: 'gym-leg-extension',     sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-wall' },
      { id: 'gym-calf-raise',        sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 0,  motion: 'motion-step' },
    ],
  },
  { key: 'rest', isRest: true, exercises: [] },
  {
    key: 'arms',
    isRest: false,
    exercises: [
      { id: 'gym-barbell-curl',         sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-dip' },
      { id: 'gym-hammer-curl',          sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-dip' },
      { id: 'gym-triceps-pushdown',     sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-push' },
      { id: 'gym-skull-crusher',        sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-push' },
      { id: 'gym-preacher-curl',        sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-dip' },
      { id: 'gym-overhead-triceps-ext', sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 0,  motion: 'motion-push' },
    ],
  },
  { key: 'rest', isRest: true, exercises: [] },
  {
    key: 'chest-shoulders',
    isRest: false,
    exercises: [
      { id: 'gym-bench-press',      sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-push' },
      { id: 'gym-incline-db-press', sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-push' },
      { id: 'gym-cable-fly',        sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-rotate' },
      { id: 'gym-overhead-press',   sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-push' },
      { id: 'gym-lateral-raise',    sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-jump' },
      { id: 'gym-front-raise',      sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 0,  motion: 'motion-push' },
    ],
  },
  { key: 'rest', isRest: true, exercises: [] },
  {
    key: 'back',
    isRest: false,
    exercises: [
      { id: 'gym-deadlift',         sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-lunge' },
      { id: 'gym-pull-up',          sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-dip' },
      { id: 'gym-barbell-row',      sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-plank' },
      { id: 'gym-lat-pulldown',     sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-dip' },
      { id: 'gym-seated-cable-row', sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 90, motion: 'motion-plank' },
      { id: 'gym-face-pull',        sets: 3, setDuration: 40, restDuration: 60, exerciseRestDuration: 0,  motion: 'motion-push' },
    ],
  },
];

export function buildGymWorkout(day: SplitDay): Exercise[] {
  const result: Exercise[] = [];
  for (let exIdx = 0; exIdx < day.exercises.length; exIdx++) {
    const ex = day.exercises[exIdx];
    const isLastExercise = exIdx === day.exercises.length - 1;
    for (let s = 0; s < ex.sets; s++) {
      const isLastSet = s === ex.sets - 1;
      result.push({ id: ex.id, name: ex.id, duration: ex.setDuration, motion: ex.motion, setNumber: s + 1, totalSets: ex.sets });
      if (!isLastSet) {
        result.push({ id: GYM_REST_ID, name: GYM_REST_ID, duration: ex.restDuration, motion: 'motion-hold', isRest: true });
      } else if (!isLastExercise) {
        result.push({ id: GYM_REST_ID, name: GYM_REST_ID, duration: ex.exerciseRestDuration, motion: 'motion-hold', isRest: true });
      }
    }
  }
  return result;
}

export function getTodaySplitIndex(): number {
  const day = new Date().getDay(); // 0=Sun, 1=Mon…6=Sat
  return day === 0 ? 6 : day - 1;
}

export function getTodaySplit(): SplitDay {
  return gymSplit[getTodaySplitIndex()];
}
