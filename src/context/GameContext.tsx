import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { GameState, ChapterId } from '../types';

/* ── Actions ── */
type Action =
  | { type: 'GO_TITLE' }
  | { type: 'START_CHAPTER'; chapter: ChapterId }
  | { type: 'NEXT_STEP' }
  | { type: 'SET_STEP'; step: number }
  | { type: 'TRANSITION'; chapter: ChapterId }
  | { type: 'ENDING' };

const initialState: GameState = {
  phase: 'title',
  chapter: 1,
  step: 0,
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'GO_TITLE':
      return { ...initialState };
    case 'START_CHAPTER':
      return { phase: 'chapter', chapter: action.chapter, step: 0 };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'TRANSITION':
      return { phase: 'transition', chapter: action.chapter, step: 0 };
    case 'ENDING':
      return { phase: 'ending', chapter: state.chapter, step: 0 };
    default:
      return state;
  }
}

/* ── Context ── */
const StateCtx = createContext<GameState>(initialState);
const DispatchCtx = createContext<Dispatch<Action>>(() => {});

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>
        {children}
      </DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useGameState() {
  return useContext(StateCtx);
}

export function useGameDispatch() {
  return useContext(DispatchCtx);
}
