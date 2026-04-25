import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Lang = 'en' | 'uk';

export interface Translations {
  appSubtitle: string;
  appTitle: string;
  status: Record<string, string>;
  exerciseX: string;
  ofTotal: string;
  timeLeft: string;
  overallProgress: string;
  start: string;
  pause: string;
  reset: string;
  upNext: string;
  cooldown: string;
  niceWork: string;
  seconds: string;
  exercises: Record<string, string>;
}

const en: Translations = {
  appSubtitle: 'Daily 7-minute flow',
  appTitle: 'Seven-Minute Workout',
  status: {
    idle: 'Ready',
    running: 'In Progress',
    paused: 'Paused',
    done: 'Complete',
  },
  exerciseX: 'Exercise',
  ofTotal: 'of',
  timeLeft: 'Time Left',
  overallProgress: 'Overall Progress',
  start: 'Start',
  pause: 'Pause',
  reset: 'Reset',
  upNext: 'Up next',
  cooldown: 'Cooldown',
  niceWork: 'Nice work!',
  seconds: 's',
  exercises: {
    'jumping-jacks': 'Jumping Jacks',
    'wall-sit': 'Wall Sit',
    'push-ups': 'Push-Ups',
    'crunches': 'Abdominal Crunches',
    'step-up': 'Step-Up onto Chair',
    'squats': 'Squats',
    'triceps-dip': 'Triceps Dip on Chair',
    'plank': 'Plank',
    'high-knees': 'High Knees',
    'lunges': 'Lunges',
    'pushup-rotation': 'Push-Up and Rotation',
    'side-plank-left': 'Side Plank (Left)',
    'side-plank-right': 'Side Plank (Right)',
  },
};

const uk: Translations = {
  appSubtitle: 'Щоденний 7-хвилинний комплекс',
  appTitle: 'Семихвилинне тренування',
  status: {
    idle: 'Готово',
    running: 'Виконується',
    paused: 'Пауза',
    done: 'Завершено',
  },
  exerciseX: 'Вправа',
  ofTotal: 'з',
  timeLeft: 'Залишилось',
  overallProgress: 'Загальний прогрес',
  start: 'Старт',
  pause: 'Пауза',
  reset: 'Скинути',
  upNext: 'Далі',
  cooldown: 'Заминка',
  niceWork: 'Чудова робота!',
  seconds: 'с',
  exercises: {
    'jumping-jacks': 'Стрибки «зірочка»',
    'wall-sit': 'Сидіння біля стіни',
    'push-ups': 'Віджимання',
    'crunches': 'Скручування преса',
    'step-up': 'Підйом на стілець',
    'squats': 'Присідання',
    'triceps-dip': 'Опускання на трицепс',
    'plank': 'Планка',
    'high-knees': 'Біг з підніманням колін',
    'lunges': 'Випади',
    'pushup-rotation': 'Віджимання з поворотом',
    'side-plank-left': 'Бічна планка (ліво)',
    'side-plank-right': 'Бічна планка (право)',
  },
};

const dict: Record<Lang, Translations> = { en, uk };

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => undefined,
});

const savedLang = (): Lang => {
  const v = localStorage.getItem('lang');
  return v === 'uk' ? 'uk' : 'en';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(savedLang);

  const setLang = (l: Lang) => {
    localStorage.setItem('lang', l);
    setLangState(l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const { lang, setLang } = useContext(LanguageContext);
  return { t: dict[lang], lang, setLang };
};
