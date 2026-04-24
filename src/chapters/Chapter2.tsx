import { useState, useCallback, useMemo } from 'react';
import ChapterShell from '../components/ChapterShell';
import DialogueBox from '../components/DialogueBox';
import RevealOverlay from '../components/RevealOverlay';
import type { DialogueLine } from '../types';
import './Chapter2.css';

interface Props { onComplete: () => void; }

/*
  The mechanic: two sliders (threshold A, threshold B) that affect
  FP rates for Group A and Group B.
  Because Group B is shifted higher on the Z-axis (historical policing),
  the math is rigged: lowering FP-A always raises FP-B and vice versa.
  The player cannot get both meters green at the same time.
*/
function computeMeters(tA: number, tB: number) {
  // Group A FP roughly follows threshold directly
  const fpA = Math.max(0, Math.min(100, Math.round(100 - tA * 90)));
  // Group B is structurally elevated: reducing tB helps but also raises fpA
  const fpB = Math.max(0, Math.min(100, Math.round(100 - tB * 60 + tA * 30)));
  return { fpA, fpB };
}

const THRESHOLD_GREEN = 25; // both must be below this

const introLines: DialogueLine[] = [
  { speaker: 'narrator', text: 'FILE RECOVERED — CrimJustice AI Dept. | 2019-09-04' },
  { speaker: 'narrator', text: 'Six months later. The same model is now predicting who goes to jail and who walks free.' },
  { speaker: 'guide', text: 'A hidden dimension was never in the training data: Historical Policing Intensity.', mood: 'serious' },
  { speaker: 'guide', text: 'Adjust the decision thresholds so that False Positive rates are equal for both groups. I dare you.', mood: 'worried' },
];

const revealLines: DialogueLine[] = [
  { speaker: 'guide', text: 'You couldn\'t make it fair for both groups simultaneously, could you?', mood: 'surprised' },
  { speaker: 'guide', text: 'Historical Bias means the data encodes decades of systemic inequality. Math cannot undo that.', mood: 'serious' },
  { speaker: 'guide', text: '"Perfect fairness" is a myth. You cannot patch a social problem with a math equation.', mood: 'worried' },
];

type Step = 'intro' | 'interaction' | 'reveal-dialogue' | 'reveal-card';

export default function Chapter2({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const [tA, setTA] = useState(0.5);
  const [tB, setTB] = useState(0.5);
  const [locked, setLocked] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);

  const handleIntroComplete = useCallback(() => setStep('interaction'), []);
  const handleRevealDialogue = useCallback(() => setStep('reveal-card'), []);

  const { fpA, fpB } = useMemo(() => computeMeters(tA, tB), [tA, tB]);

  const bothGreen = fpA < THRESHOLD_GREEN && fpB < THRESHOLD_GREEN;

  // If player gets close to both green, the sliders snap back (rigged)
  const handleTA = useCallback((v: number) => {
    setTA(v);
    const { fpA: a, fpB: b } = computeMeters(v, tB);
    if (a < THRESHOLD_GREEN && b < THRESHOLD_GREEN) {
      setTimeout(() => { setTA(0.5); setTB(0.5); setAlarmActive(true); setTimeout(() => setAlarmActive(false), 800); }, 80);
    }
  }, [tB]);

  const handleTB = useCallback((v: number) => {
    setTB(v);
    const { fpA: a, fpB: b } = computeMeters(tA, v);
    if (a < THRESHOLD_GREEN && b < THRESHOLD_GREEN) {
      setTimeout(() => { setTA(0.5); setTB(0.5); setAlarmActive(true); setTimeout(() => setAlarmActive(false), 800); }, 80);
    }
  }, [tA]);

  const handleGiveUp = useCallback(() => {
    setLocked(true);
    setTimeout(() => setStep('reveal-dialogue'), 800);
  }, []);

  const meterColor = (val: number) =>
    val < THRESHOLD_GREEN ? '#4aff91' : val < 55 ? '#ffd060' : '#ff5060';

  return (
    <ChapterShell chapterNumber={2} title="The Illusion of Fair Math">
      {step === 'intro' && (
        <DialogueBox lines={introLines} onComplete={handleIntroComplete} />
      )}

      {step === 'interaction' && (
        <div className={`ch2-layout ${alarmActive ? 'alarm' : ''}`}>
          <div className="ch2-header mono">
            CRIMINAL JUSTICE DASHBOARD — BIAS AUDIT MODULE
          </div>

          {alarmActive && (
            <div className="ch2-alarm mono">⚠ SYSTEM OVERRIDE — Mathematical constraint violated</div>
          )}

          <div className="ch2-meters">
            {/* Group A */}
            <div className="ch2-meter-block">
              <div className="ch2-meter-label mono">GROUP A — False Positive Rate</div>
              <div className="ch2-bar-track">
                <div
                  className="ch2-bar-fill"
                  style={{ width: `${fpA}%`, background: meterColor(fpA) }}
                />
              </div>
              <div className="ch2-meter-pct mono" style={{ color: meterColor(fpA) }}>
                {fpA}%
              </div>
            </div>

            {/* Group B */}
            <div className="ch2-meter-block">
              <div className="ch2-meter-label mono">
                GROUP B — False Positive Rate
                <span className="ch2-z-tag mono"> [+Z: historical policing bias]</span>
              </div>
              <div className="ch2-bar-track">
                <div
                  className="ch2-bar-fill"
                  style={{ width: `${fpB}%`, background: meterColor(fpB) }}
                />
              </div>
              <div className="ch2-meter-pct mono" style={{ color: meterColor(fpB) }}>
                {fpB}%
              </div>
            </div>

            <div className="ch2-target mono">TARGET: Both below {THRESHOLD_GREEN}%</div>
          </div>

          <div className="ch2-sliders">
            <label className={`ch2-slider-label mono ${locked ? 'locked' : ''}`}>
              THRESHOLD — GROUP A: {(tA * 100).toFixed(0)}
              <input type="range" min="0" max="1" step="0.01"
                value={tA} onChange={e => handleTA(+e.target.value)}
                disabled={locked}
              />
            </label>
            <label className={`ch2-slider-label mono ${locked ? 'locked' : ''}`}>
              THRESHOLD — GROUP B: {(tB * 100).toFixed(0)}
              <input type="range" min="0" max="1" step="0.01"
                value={tB} onChange={e => handleTB(+e.target.value)}
                disabled={locked}
              />
            </label>
          </div>

          {!locked && !bothGreen && (
            <button className="ch2-give-up mono" onClick={handleGiveUp}>
              [ ACCEPT: FAIRNESS IS IMPOSSIBLE ]
            </button>
          )}

          {locked && (
            <div className="ch2-locked-note mono">⛔ Sliders locked — mathematical deadlock confirmed.</div>
          )}
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
