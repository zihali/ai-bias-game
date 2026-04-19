import { useState, useCallback } from 'react';
import ChapterShell from '../components/ChapterShell';
import DialogueBox from '../components/DialogueBox';
import CharacterSprite from '../components/CharacterSprite';
import RevealOverlay from '../components/RevealOverlay';
import type { DialogueLine } from '../types';

interface Props {
  onComplete: () => void;
}

const introLines: DialogueLine[] = [
  { speaker: 'narrator', text: 'The model goes live. It is flawed — everyone knows it — but "human experts" will catch the mistakes. Right?' },
  { speaker: 'guide', text: 'You are now the Human in the Loop. Five cases will come through.', mood: 'neutral' },
  { speaker: 'guide', text: 'The AI will make a prediction. You can agree or override. Simple.', mood: 'happy' },
  { speaker: 'guide', text: 'But ask yourself: how often will you really disagree with a machine that sounds so confident?', mood: 'serious' },
];

const revealLines: DialogueLine[] = [
  { speaker: 'guide', text: 'Let me show you your own statistics...', mood: 'surprised' },
  { speaker: 'guide', text: 'Most people defer to the AI far too often. And when they do override, they introduce their OWN biases.', mood: 'worried' },
  { speaker: 'guide', text: 'This is Human Feedback Bias. The loop doesn\'t fix the system—it just adds another layer of imperfection.', mood: 'serious' },
];

type Step = 'intro' | 'interaction' | 'reveal-dialogue' | 'reveal-card';

export default function Chapter3({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('intro');

  const handleIntroComplete = useCallback(() => setStep('interaction'), []);
  const handleRevealDialogue = useCallback(() => setStep('reveal-card'), []);

  return (
    <ChapterShell chapterNumber={3} title="The Human Element">
      <CharacterSprite
        visible={step === 'intro' || step === 'reveal-dialogue'}
        mood={step === 'reveal-dialogue' ? 'surprised' : 'neutral'}
        position="left"
      />

      {step === 'intro' && (
        <DialogueBox lines={introLines} onComplete={handleIntroComplete} />
      )}

      {step === 'interaction' && (
        <div className="interaction-placeholder">
          <p style={{ color: '#ccaa6a', textAlign: 'center' }}>
            [ Rapid-fire case predictions – Agree / Override ]
          </p>
          <button
            className="title-start"
            style={{ marginTop: '1rem' }}
            onClick={() => setStep('reveal-dialogue')}
          >
            Finish Cases
          </button>
        </div>
      )}

      {step === 'reveal-dialogue' && (
        <DialogueBox lines={revealLines} onComplete={handleRevealDialogue} />
      )}

      {step === 'reveal-card' && (
        <RevealOverlay onDismiss={onComplete}>
          <h3>🧠 Human Feedback Bias</h3>
          <p>
            Humans trust confident-sounding systems—even flawed ones. And when they
            override, their corrections reflect personal biases. The "human in the loop"
            is not a safety net; it's another source of error.
          </p>
        </RevealOverlay>
      )}
    </ChapterShell>
  );
}
