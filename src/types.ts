/* ── Shared types used across the game ── */

export interface DialogueLine {
  speaker: 'narrator' | 'guide' | 'player';
  text: string;
  /** Optional emotion/pose key for the character sprite */
  mood?: 'neutral' | 'happy' | 'serious' | 'surprised' | 'worried';
}

export interface DialogueScript {
  id: string;
  lines: DialogueLine[];
  /** Called when the last line is dismissed */
  onComplete?: () => void;
}

export type ChapterId = 1 | 2 | 3;

export type GamePhase = 'title' | 'chapter' | 'transition' | 'ending';

export interface GameState {
  phase: GamePhase;
  chapter: ChapterId;
  /** Chapter-local step so each chapter can drive its own flow */
  step: number;
}
