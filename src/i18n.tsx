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
  homeMode: string;
  gymMode: string;
  todaysFocus: string;
  getReady: string;
  restLabel: string;
  restDay: string;
  restDayMessage: string;
  setLabel: string;
  weeklySchedule: string;
  muscleGroups: Record<string, string>;
  days: string[];
  exerciseDescriptions: Record<string, string>;
}

const en: Translations = {
  appSubtitle: 'Daily 7-minute flow',
  appTitle: 'Seven-Minute Workout',
  status: {
    idle: 'Ready',
    countdown: 'Get Ready',
    running: 'In Progress',
    rest: 'Rest',
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
    'gym-rest': 'Rest',
    'gym-barbell-squat': 'Barbell Squat',
    'gym-leg-press': 'Leg Press',
    'gym-romanian-deadlift': 'Romanian Deadlift',
    'gym-leg-curl': 'Leg Curl',
    'gym-leg-extension': 'Leg Extension',
    'gym-calf-raise': 'Calf Raise',
    'gym-barbell-curl': 'Barbell Curl',
    'gym-hammer-curl': 'Hammer Curl',
    'gym-triceps-pushdown': 'Triceps Pushdown',
    'gym-skull-crusher': 'Skull Crusher',
    'gym-preacher-curl': 'Preacher Curl',
    'gym-overhead-triceps-ext': 'Overhead Triceps Extension',
    'gym-bench-press': 'Bench Press',
    'gym-incline-db-press': 'Incline Dumbbell Press',
    'gym-cable-fly': 'Cable Fly',
    'gym-overhead-press': 'Overhead Press',
    'gym-lateral-raise': 'Lateral Raise',
    'gym-front-raise': 'Front Raise',
    'gym-deadlift': 'Deadlift',
    'gym-pull-up': 'Pull-Up',
    'gym-barbell-row': 'Barbell Row',
    'gym-lat-pulldown': 'Lat Pulldown',
    'gym-seated-cable-row': 'Seated Cable Row',
    'gym-face-pull': 'Face Pull',
  },
  homeMode: 'Home',
  gymMode: 'Gym',
  todaysFocus: "Today's focus",
  getReady: 'Get Ready!',
  restLabel: 'Rest',
  restDay: 'Rest Day',
  restDayMessage: 'Recovery is part of training. Rest up!',
  setLabel: 'Set',
  weeklySchedule: 'Weekly Split',
  muscleGroups: {
    legs: 'Legs',
    arms: 'Arms',
    'chest-shoulders': 'Chest + Shoulders',
    back: 'Back',
    rest: 'Rest',
  },
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  exerciseDescriptions: {
    'gym-barbell-squat': 'Feet shoulder-width, bar on upper traps. Chest up, knees tracking toes. Descend until thighs are parallel to the floor, then drive up through your heels.',
    'gym-leg-press': 'Feet shoulder-width on the platform. Lower until knees reach 90°, press through heels back to start. Do not lock out your knees at the top.',
    'gym-romanian-deadlift': 'Hinge at the hips with a soft knee bend, bar sliding down your legs. Feel the hamstring stretch at the bottom, then drive your hips forward to stand.',
    'gym-leg-curl': 'Lie face down on the machine, pad just above your heels. Curl your heels toward your glutes, pause at the top, lower slowly.',
    'gym-leg-extension': 'Sit on the machine with the pad on your shins. Extend your legs until straight, hold for a second at the top, lower with control.',
    'gym-calf-raise': 'Stand on the edge of a step, heels hanging off. Lower heels below the step, then press up onto your toes as high as possible. Hold, then lower slowly.',
    'gym-barbell-curl': 'Elbows pinned to your sides. Curl the bar up toward your chin, squeeze your biceps hard at the top, lower slowly back to full extension.',
    'gym-hammer-curl': 'Neutral grip with thumbs facing up. Curl in this position to target the brachialis and brachioradialis for thicker arm development.',
    'gym-triceps-pushdown': 'Cable set at face height, elbows tucked to your sides. Push the bar or rope down until arms are fully extended. Control the return.',
    'gym-skull-crusher': 'Lie on a bench with an EZ-bar above your forehead. Bend elbows to lower the bar toward your forehead, then extend back up. Keep upper arms vertical.',
    'gym-preacher-curl': 'Rest arms flat on the angled pad. Curl from full extension up to peak contraction, squeeze, then lower to a full stretch.',
    'gym-overhead-triceps-ext': 'Hold a dumbbell overhead with both hands. Bend your elbows to lower the weight behind your head, then extend back to the start. Keep elbows close.',
    'gym-bench-press': 'Grip slightly wider than shoulders. Lower the bar to your mid-chest with elbows at ~45°, then press up and slightly back over your lower chest.',
    'gym-incline-db-press': 'Set bench to 30–45°. Press dumbbells from shoulder level, let them arc slightly together at the top. Control the descent.',
    'gym-cable-fly': 'Pulleys at shoulder height, slight bend in elbows. Bring the handles together in a hugging arc in front of your chest, squeeze your pecs, return slowly.',
    'gym-overhead-press': 'Bar at collar-bone level, grip shoulder-width. Press straight up until arms lock out. Lower back to the start under control.',
    'gym-lateral-raise': 'Slight bend in elbows, thumbs slightly down. Raise arms out to the side to shoulder height, leading with your elbows. Lower slowly.',
    'gym-front-raise': 'Slight bend in elbows. Raise both arms forward to shoulder height. Avoid swinging. Lower slowly back to your sides.',
    'gym-deadlift': 'Bar over mid-foot, hip-width stance. Hinge down and grip just outside your legs. Chest tall, push the floor away to stand, then hinge back down.',
    'gym-pull-up': 'Overhand grip slightly wider than shoulders. Pull until your chin clears the bar, then lower until arms are fully straight. Avoid kipping.',
    'gym-barbell-row': 'Hinge to about 45°, bar under your shoulders. Pull the bar to your lower chest or upper stomach, squeeze your shoulder blades together. Lower with control.',
    'gym-lat-pulldown': 'Wide overhand grip. Pull the bar to your upper chest, driving elbows down and out. Squeeze your lats at the bottom, return slowly.',
    'gym-seated-cable-row': 'Feet on the platform, slight bend in knees. Pull the handle to your stomach, squeeze shoulder blades together at the end. Control the return.',
    'gym-face-pull': 'Cable at face height with a rope attachment. Pull to your face while flaring your elbows outward. Squeeze your rear delts and external rotators at the end.',
  },
};

const uk: Translations = {
  appSubtitle: 'Щоденний 7-хвилинний комплекс',
  appTitle: 'Семихвилинне тренування',
  status: {
    idle: 'Готово',
    countdown: 'Приготуйтесь',
    running: 'Виконується',
    rest: 'Відпочинок',
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
    'gym-rest': 'Відпочинок',
    'gym-barbell-squat': 'Присідання зі штангою',
    'gym-leg-press': 'Жим ногами',
    'gym-romanian-deadlift': 'Румунська тяга',
    'gym-leg-curl': 'Згинання ніг',
    'gym-leg-extension': 'Розгинання ніг',
    'gym-calf-raise': 'Підйом на носки',
    'gym-barbell-curl': 'Згинання зі штангою',
    'gym-hammer-curl': 'Молоткові згинання',
    'gym-triceps-pushdown': 'Розгинання на трицепс',
    'gym-skull-crusher': 'Французький жим',
    'gym-preacher-curl': 'Згинання на лаві Скотта',
    'gym-overhead-triceps-ext': 'Розгинання з-за голови',
    'gym-bench-press': 'Жим лежачи',
    'gym-incline-db-press': 'Жим гантелей під кутом',
    'gym-cable-fly': 'Зведення в кросовері',
    'gym-overhead-press': 'Жим над головою',
    'gym-lateral-raise': 'Бічні підйоми',
    'gym-front-raise': 'Підйоми перед собою',
    'gym-deadlift': 'Станова тяга',
    'gym-pull-up': 'Підтягування',
    'gym-barbell-row': 'Тяга штанги в нахилі',
    'gym-lat-pulldown': 'Тяга зверху',
    'gym-seated-cable-row': 'Тяга сидячи',
    'gym-face-pull': 'Тяга до обличчя',
  },
  homeMode: 'Дім',
  gymMode: 'Зал',
  todaysFocus: 'Сьогодні',
  getReady: 'Приготуйтесь!',
  restLabel: 'Відпочинок',
  restDay: 'День відпочинку',
  restDayMessage: 'Відновлення — частина тренувань. Відпочивай!',
  setLabel: 'Підхід',
  weeklySchedule: 'Сплітний тиждень',
  muscleGroups: {
    legs: 'Ноги',
    arms: 'Руки',
    'chest-shoulders': 'Груди + Плечі',
    back: 'Спина',
    rest: 'Відпочинок',
  },
  days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
  exerciseDescriptions: {
    'gym-barbell-squat': 'Ноги на ширині плечей, штанга на трапеціях. Груди вгору, коліна вздовж носків. Опускайтеся до паралелі стегон з підлогою, потім встаньте через п\'яти.',
    'gym-leg-press': 'Стопи на ширині плечей на платформі. Опускайте до 90° в колінах, жміть через п\'яти назад. Не блокуйте коліна вгорі.',
    'gym-romanian-deadlift': 'Нахил у стегнах з м\'якими колінами, штанга вздовж ніг. Відчуйте розтяжку двоголових м\'язів стегна, потім поштовхом стегон уперед поверніться у вихідне положення.',
    'gym-leg-curl': 'Ляжте обличчям вниз на тренажері, подушка над п\'ятами. Зігніть ноги до сідниць, пауза вгорі, повільно опустіть.',
    'gym-leg-extension': 'Сидячи на тренажері, подушка на гомілках. Розгинайте ноги до прямого положення, затримайтеся вгорі, повільно опустіть.',
    'gym-calf-raise': 'Стійте на краю сходинки, п\'яти звисають. Опустіть п\'яти нижче краю, потім піднімайтеся на носки якомога вище. Утримуйте, повільно опускайтеся.',
    'gym-barbell-curl': 'Лікті притиснуті до тіла. Згинайте гриф до підборіддя, сильно стискайте біцепс вгорі, повільно опускайте до повного розгинання.',
    'gym-hammer-curl': 'Нейтральний хват, великий палець вгору. Згинайте в такому положенні для опрацювання брахіаліса та брахіорадіаліса — надає руці ширину та товщину.',
    'gym-triceps-pushdown': 'Блок на рівні обличчя, лікті притиснуті до тіла. Розгинайте руки вниз до повного випрямлення. Контрольоване повернення.',
    'gym-skull-crusher': 'Лежачи на лаві з EZ-грифом над чолом. Згинайте лікті, опускаючи гриф до чола, потім розгинайте назад. Тримайте плечі вертикально.',
    'gym-preacher-curl': 'Руки лежать на похилій підставці. Згинайте з повного розгинання до піку скорочення, стискайте біцепс, опускайте до повного розтягу.',
    'gym-overhead-triceps-ext': 'Тримайте гантель над головою двома руками. Згинайте лікті, опускаючи снаряд за голову, потім розгинайте. Тримайте лікті близько до голови.',
    'gym-bench-press': 'Хват трохи ширше плечей. Опускайте гриф до середини грудей, лікті під кутом ~45°. Жміть вгору і злегка назад над нижньою частиною грудей.',
    'gym-incline-db-press': 'Лава під кутом 30–45°. Жміть гантелі від рівня плечей, даючи їм злегка зближуватися вгорі. Контролюйте опускання.',
    'gym-cable-fly': 'Блоки на рівні плечей, лікті злегка зігнуті. Зводьте рукоятки дугою перед грудьми, стискайте грудні. Повільно повертайте.',
    'gym-overhead-press': 'Гриф на рівні ключиць, хват на ширині плечей. Жміть прямо вгору до повного замку. Повільно опускайте у вихідне положення.',
    'gym-lateral-raise': 'Злегка зігнуті лікті, великі пальці злегка вниз. Піднімайте руки убік до рівня плечей, ведіть ліктями. Повільно опускайте.',
    'gym-front-raise': 'Злегка зігнуті лікті. Піднімайте руки вперед до рівня плечей без розкачування. Повільно опускайте в сторони.',
    'gym-deadlift': 'Гриф над серединою стопи, хват на ширині стегон. Нахиліться і схопіть гриф зовні ніг. Груди вгору, штовхайте підлогу ногами, щоб встати, потім нахиляйтеся назад.',
    'gym-pull-up': 'Хват зверху, трохи ширше плечей. Підтягуйтеся до підборіддя вище перекладини, потім опускайтеся до повного розгинання рук. Без розгойдування.',
    'gym-barbell-row': 'Нахил приблизно 45°, штанга під плечима. Тягніть до нижньої частини грудей або верхнього пресу, стискайте лопатки разом. Повільно опускайте.',
    'gym-lat-pulldown': 'Широкий хват зверху. Тягніть гриф до верхніх грудей, ведучи лікті вниз і назовні. Стискайте найширші внизу, повільно повертайте.',
    'gym-seated-cable-row': 'Стопи на підставці, коліна злегка зігнуті. Тягніть рукоятку до живота, стискайте лопатки в кінці. Контрольоване повернення.',
    'gym-face-pull': 'Блок на рівні обличчя, мотузкова рукоятка. Тягніть до обличчя, розводячи лікті назовні. Стискайте задні дельти та зовнішні ротатори в кінці руху.',
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
