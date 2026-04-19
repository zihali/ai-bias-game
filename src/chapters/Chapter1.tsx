import { useState, useCallback } from 'react';
import ChapterShell from '../components/ChapterShell';
import DialogueBox from '../components/DialogueBox';
import CharacterSprite from '../components/CharacterSprite';
import RevealOverlay from '../components/RevealOverlay';
import type { DialogueLine } from '../types';

interface Props {
  onComplete: () => void;
}

/* ── Dialogue script for Ch1 intro ── */
const introLines: DialogueLine[] = [
  { speaker: 'narrator', text: 'The year is 2019. A mid-size tech company has just shipped its first AI-powered resume screening tool.' },
  { speaker: 'guide', text: 'Welcome. I\'m Dr. Aira. I\'ll be guiding you through this experience.', mood: 'neutral' },
  { speaker: 'guide', text: 'Your task is simple: I\'ll show you some data points, and you\'ll draw a line to separate "qualified" from "unqualified" candidates.', mood: 'happy' },
  { speaker: 'guide', text: 'Ready? Let\'s see what you come up with.', mood: 'neutral' },
];

const revealLines: DialogueLine[] = [
  { speaker: 'guide', text: 'Interesting line you drew there. Now let me show you what the REAL world looks like...', mood: 'serious' },
  { speaker: 'guide', text: 'See those 10,000 new points? Your "fair" boundary just discriminated against an entire cluster of people.', mood: 'worried' },
  { speaker: 'guide', text: 'This is called Sampling Bias. When your training data doesn\'t represent reality, even the best intentions produce harm.', mood: 'serious' },
];

type Step = 'intro' | 'interaction' | 'reveal-dialogue' | 'reveal-card';

export default function Chapter1({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('intro');

  const handleIntroComplete = useCallback(() => setStep('interaction'), []);
  const handleRevealDialogue = useCallback(() => setStep('reveal-card'), []);

  return (
    <ChapterShell chapterNumber={1} title="The Trap of Simple Data">
      {/* Guide sprite visible during dialogues */}
      <CharacterSprite
        visible={step === 'intro' || step === 'reveal-dialogue'}
        mood={step === 'reveal-dialogue' ? 'serious' : 'neutral'}
        position="left"
      />

      {/* ── Step: Intro Dialogue ── */}
      {step === 'intro' && (
        <DialogueBox lines={introLines} onComplete={handleIntroComplete} />
      )}

      {/* ── Step: Main Interaction (placeholder) ── */}
      {step === 'interaction' && (
        <div className="interaction-placeholder">
          <p style={{ color: '#8aa4cc', textAlign: 'center' }}>
            [ Interactive graph – draw boundary line here ]
          </p>
          <button
            style={{ marginTop: '1rem' }}
            className="title-start"
            onClick={() => setStep('reveal-dialogue')}
          >
            Submit Line
          </button>
        </div>
      )}

      {/* ── Step: Reveal Dialogue ── */}
      {step === 'reveal-dialogue' && (
        <DialogueBox lines={revealLines} onComplete={handleRevealDialogue} />
      )}

      {/* ── Step: Reveal Card ── */}
      {step === 'reveal-card' && (
        <RevealOverlay onDismiss={onComplete}>
          <h3>🔍 Sampling Bias</h3>
          <p>
            You were given only 20 data points drawn from a skewed sample.
            In the real world those 10,000 points paint a very different picture.
            A model trained on unrepresentative data will replicate—and amplify—existing inequalities.
          </p>
        </RevealOverlay>
      )}
    </ChapterShell>
  );
}
