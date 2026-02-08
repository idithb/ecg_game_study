
import { ActivityLevel, DayEvent } from './types';

export const MAX_ROUNDS = 6;

export const DAILY_SCHEDULE: DayEvent[] = [
  { time: '02:00', activity: ActivityLevel.SLEEPING, description: 'לילה עמוק, הגוף במנוחה מוחלטת.' },
  { time: '08:30', activity: ActivityLevel.WALKING, description: 'הליכה קלה לעבודה באוויר הקריר.' },
  { time: '11:15', activity: ActivityLevel.CRISIS, description: 'פתאום משהו לא מרגיש תקין בלב...' },
  { time: '16:00', activity: ActivityLevel.SPRINTING, description: 'אימון ריצה אינטנסיבי בפארק.' },
  { time: '19:45', activity: ActivityLevel.CRISIS, description: 'שוב דפיקות לב לא סדירות בערב.' },
  { time: '23:30', activity: ActivityLevel.SLEEPING, description: 'סוף היום, חזרה לשינה והתאוששות.' }
];

export const BPM_MAP: Record<ActivityLevel, number> = {
  [ActivityLevel.SLEEPING]: 60,
  [ActivityLevel.WALKING]: 100,
  [ActivityLevel.SPRINTING]: 170,
  [ActivityLevel.CRISIS]: 0
};

export const SCIENTIFIC_FACTS = {
  [ActivityLevel.SLEEPING]: "נכון! בזמן שינה הלב פועם בקצב נמוך כדי לחסוך באנרגיה.",
  [ActivityLevel.WALKING]: "מעולה! הליכה מעלה מעט את הדופק כדי להזרים חמצן לשרירים.",
  [ActivityLevel.SPRINTING]: "בדיוק! במאמץ גבוה הלב מגיע לדופק גבוה מאוד כדי לעמוד בדרישת השרירים.",
  [ActivityLevel.CRISIS]: "נכון. זהו מקצב לא תקין המעיד על הפרעה חשמלית בלב."
};

export const ECG_COLORS = {
  line: '#00ff41',
  glow: 'rgba(0, 255, 65, 0.5)',
  grid: '#003300'
};
