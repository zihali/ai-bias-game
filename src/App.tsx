import { useCallback } from 'react';
import { GameProvider, useGameState, useGameDispatch } from './context/GameContext';
import TitleScreen from './screens/TitleScreen';
import EndingScreen from './screens/EndingScreen';
import TransitionScreen from './components/TransitionScreen';
import Chapter1 from './chapters/Chapter1';
import Chapter2 from './chapters/Chapter2';
import Chapter3 from './chapters/Chapter3';
import type { ChapterId } from './types';

const CHAPTER_TITLES: Record<ChapterId, string> = {
  1: 'Chapter 1: The Trap of Simple Data',
  2: 'Chapter 2: The Illusion of Fair Math',
  3: 'Chapter 3: The Human Element',
};

function GameRouter() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const startGame = useCallback(() => {
    dispatch({ type: 'TRANSITION', chapter: 1 });
  }, [dispatch]);

  const handleTransitionDone = useCallback(() => {
    dispatch({ type: 'START_CHAPTER', chapter: state.chapter });
  }, [dispatch, state.chapter]);

  const handleChapterComplete = useCallback(() => {
    const next = (state.chapter + 1) as ChapterId;
    if (next <= 3) {
      dispatch({ type: 'TRANSITION', chapter: next });
    } else {
      dispatch({ type: 'ENDING' });
    }
  }, [dispatch, state.chapter]);

  const handleRestart = useCallback(() => {
    dispatch({ type: 'GO_TITLE' });
  }, [dispatch]);

  switch (state.phase) {
    case 'title':
      return <TitleScreen onStart={startGame} />;

    case 'transition':
      return (
        <TransitionScreen
          title={CHAPTER_TITLES[state.chapter]}
          subtitle="Prepare yourself..."
          onDone={handleTransitionDone}
        />
      );

    case 'chapter':
      switch (state.chapter) {
        case 1: return <Chapter1 onComplete={handleChapterComplete} />;
        case 2: return <Chapter2 onComplete={handleChapterComplete} />;
        case 3: return <Chapter3 onComplete={handleChapterComplete} />;
      }
      break;

    case 'ending':
      return <EndingScreen onRestart={handleRestart} />;
  }

  return null;
}

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
