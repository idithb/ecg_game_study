
export enum ActivityLevel {
  SLEEPING = 'שינה',
  WALKING = 'הליכה',
  SPRINTING = 'ריצה מהירה',
  CRISIS = 'מצב חירום'
}

export enum GamePhase {
  INTRO = 'intro',
  READY = 'ready',
  PLAYING = 'playing',
  FINISHED = 'finished'
}

export interface DayEvent {
  time: string;
  activity: ActivityLevel;
  description: string;
}

export interface GameState {
  score: number;
  currentRoundIndex: number;
  phase: GamePhase;
  feedback: {
    show: boolean;
    isCorrect: boolean;
    message: string;
  };
}
