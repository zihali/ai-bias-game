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
  { speaker: 'narrator', text: 'Six months later. The same model—barely tested—has been sold to the criminal justice system.' },
  { speaker: 'guide', text: 'Congratulations, your model is now predicting who goes to jail and who walks free.', mood: 'serious' },
  { speaker: 'guide', text: 'But there\'s a hidden dimension the model never saw: historical arrest rates vs. actual crime rates.', mood: 'worried' },
  { speaker: 'guide', text: 'Try to draw a 3D boundary that treats everyone equally. Go on—I dare you.', mood: 'serious' },
];

const revealLines: DialogueLine[] = [
  { speaker: 'guide', text: 'You can\'t make it mathematically "fair" for everyone, can you?', mood: 'surprised' },
  { speaker: 'guide', text: 'Historical Bias means the data itself encodes decades of systemic inequality.', mood: 'serious' },
  { speaker: 'guide', text: 'A model built for résumés should never decide someone\'s freedom. Context matters.', mood: 'worried' },
];

type Step = 'intro' | 'interaction' | 'reveal-dialogue' | 'reveal-card';

export default function Chapter2({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('intro');

  const handleIntroComplete = useCallback(() => setStep('interaction'), []);
  const handleRevealDialogue = useCallback(() => setStep('reveal-card'), []);

  return (
    <ChapterShell chapterNumber={2} title="The Illusion of Fair Math">
      <CharacterSprite
        visible={step === 'intro' || step === 'reveal-dialogue'}
        mood={step === 'reveal-dialogue' ? 'worried' : 'serious'}
        position="left"
      />

      {step === 'intro' && (
        <DialogueBox lines={introLines} onComplete={handleIntroComplete} />
      )}

      {step === 'interaction' && (
        <div className="interaction-placeholder">
          <p style={{ color: '#b08acc', textAlign: 'center' }}>
            [ 3D scatter plot – adjust fairness boundary here ]
          </p>
          <button
            className="title-start"
            style={{ marginTop: '1rem' }}
            onClick={() => setStep('reveal-dialogue')}
          >
            Apply Boundary
          </button>
        </div>
      )}

      {step === 'reveal-dialogue' && (
        <DialogueBox lines={revealLines} onComplete={handleRevealDialogue} />
      )}

      {step === 'reveal-card' && (
        <RevealOverlay onDismiss={onComplete}>
          <h3>⚖️ Historical Bias</h3>
          <p>
            When historical data reflects systemic oppression, any "equal" mathematical
            boundary will perpetuate that oppression. Perfect fairness is a myth when the
            ground truth itself is biased.
          </p>
        </RevealOverlay>
      )}
    </ChapterShell>
  );
}
