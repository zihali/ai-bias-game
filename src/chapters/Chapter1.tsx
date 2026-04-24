import { useState, useCallback, useMemo } from 'react';
import ChapterShell from '../components/ChapterShell';
import DialogueBox from '../components/DialogueBox';
import RevealOverlay from '../components/RevealOverlay';
import type { DialogueLine } from '../types';
import './Chapter1.css';

interface Props { onComplete: () => void; }

/* ── Seeded pseudo-random (reproducible layout) ── */
function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

/* ── Training points: 20, skewed toward dominant group ── */
const TRAINING: { x: number; y: number; hired: boolean }[] = (() => {
  const rng = seededRandom(42);
  return Array.from({ length: 20 }, (_, i) => {
    const dominant = i < 15; // 15 dominant, 5 marginalised
    const x = dominant ? 0.4 + rng() * 0.5 : 0.1 + rng() * 0.3;
    const y = dominant ? 0.4 + rng() * 0.5 : 0.15 + rng() * 0.25;
    return { x, y, hired: dominant };
  });
})();

/* ── 10 000 real-world points ── */
const REAL_WORLD: { x: number; y: number; hired: boolean }[] = (() => {
  const rng = seededRandom(99);
  return Array.from({ length: 10000 }, (_, i) => {
    const dominant = i < 6000;
    const x = dominant ? 0.35 + rng() * 0.55 : 0.05 + rng() * 0.55;
    const y = dominant ? 0.35 + rng() * 0.55 : 0.05 + rng() * 0.55;
    return { x, y, hired: dominant };
  });
})();

const SVG = 300; // viewBox size

function lineY(x: number, slope: number, intercept: number) {
  return intercept - slope * x; // y = intercept - slope*x (in 0–1 space)
}

function aboveLineHired(slope: number, intercept: number, x: number, y: number) {
  // points above the line → hired prediction
  return y > lineY(x, slope, intercept);
}

function accuracy(points: typeof TRAINING, slope: number, intercept: number) {
  const correct = points.filter(
    p => aboveLineHired(slope, intercept, p.x, p.y) === p.hired
  ).length;
  return Math.round((correct / points.length) * 100);
}

/* ── Dialogue ── */
const introLines: DialogueLine[] = [
  { speaker: 'narrator', text: 'FILE RECOVERED — NovaTech, Inc. | 2019-03-12' },
  { speaker: 'narrator', text: 'The year is 2019. NovaTech has just shipped its first AI-powered résumé screening tool.' },
  { speaker: 'guide', text: 'Welcome. I\'m Dr. Aira. I\'ll be your guide through these recovered case files.', mood: 'neutral' },
  { speaker: 'guide', text: 'Your task: adjust the slope and intercept to draw a boundary that separates HIRED (blue) from REJECTED (red) candidates.', mood: 'happy' },
  { speaker: 'guide', text: 'The system will score your accuracy. Get it high, then deploy the model. Ready?', mood: 'neutral' },
];

const revealLines: DialogueLine[] = [
  { speaker: 'guide', text: 'Interesting boundary you drew. Now let me show you what the REAL world looks like…', mood: 'serious' },
  { speaker: 'guide', text: 'See those 10,000 new points? An entire cluster of qualified applicants lands in your rejected zone.', mood: 'worried' },
  { speaker: 'guide', text: 'You didn\'t create the bias. You inherited it by training on a distorted sample of reality. That\'s Sampling Bias.', mood: 'serious' },
];

type Step = 'intro' | 'interaction' | 'reveal-dialogue' | 'reveal-card';

export default function Chapter1({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const [slope, setSlope] = useState(1.0);
  const [intercept, setIntercept] = useState(0.5);
  const [revealed, setRevealed] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleIntroComplete = useCallback(() => setStep('interaction'), []);
  const handleRevealDialogue = useCallback(() => setStep('reveal-card'), []);

  const trainAcc = useMemo(() => accuracy(TRAINING, slope, intercept), [slope, intercept]);

  const handleDeploy = useCallback(() => {
    setShaking(true);
    setTimeout(() => { setShaking(false); setRevealed(true); }, 600);
    setTimeout(() => setStep('reveal-dialogue'), 2200);
  }, []);

  const realAcc = useMemo(
    () => revealed ? accuracy(REAL_WORLD.slice(0, 2000), slope, intercept) : null,
    [revealed, slope, intercept]
  );

  /* ── Convert data coords → SVG coords ── */
  const toSVG = (v: number) => v * SVG;

  const x1svg = 0, x2svg = SVG;
  const y1svg = SVG - toSVG(lineY(0, slope, intercept));
  const y2svg = SVG - toSVG(lineY(1, slope, intercept));

  const displayPoints = revealed
    ? REAL_WORLD.slice(0, 2000)
    : TRAINING;

  return (
    <ChapterShell chapterNumber={1} title="The Trap of Simple Data">
      {step === 'intro' && (
        <DialogueBox lines={introLines} onComplete={handleIntroComplete} />
      )}

      {step === 'interaction' && (
        <div className={`ch1-layout ${shaking ? 'shake' : ''}`}>
          {/* Graph */}
          <div className="ch1-graph-wrap">
            <div className="ch1-graph-label mono">CANDIDATE DATASET — {revealed ? '10,000 pts (real world)' : '20 pts (training sample)'}</div>
            <svg
              className="ch1-svg"
              viewBox={`0 0 ${SVG} ${SVG}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Axes */}
              <line x1="0" y1={SVG} x2={SVG} y2={SVG} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <line x1="0" y1="0" x2="0" y2={SVG} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              {/* Points */}
              {displayPoints.map((p, i) => (
                <circle
                  key={i}
                  cx={toSVG(p.x)}
                  cy={SVG - toSVG(p.y)}
                  r={revealed ? 1.5 : 4}
                  fill={p.hired ? '#4a8fff' : '#ff5060'}
                  opacity={revealed ? 0.5 : 0.9}
                />
              ))}
              {/* Decision line */}
              <line
                x1={x1svg} y1={y1svg} x2={x2svg} y2={y2svg}
                stroke="#4aff91"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            </svg>
            <div className="ch1-axis-labels mono">
              <span>← Tech Score →</span>
              <span style={{ position: 'absolute', left: '-2rem', top: '50%', transform: 'rotate(-90deg) translateX(-50%)', transformOrigin: 'center' }}>Experience</span>
            </div>
          </div>

          {/* Controls */}
          <div className="ch1-controls">
            <div className="ch1-accuracy-badge mono" data-bad={trainAcc < 70}>
              {revealed && realAcc !== null ? (
                <>REAL-WORLD ACCURACY<br /><span className="ch1-acc-num bad">{realAcc}%</span></>
              ) : (
                <>TRAINING ACCURACY<br /><span className={`ch1-acc-num ${trainAcc >= 80 ? 'good' : ''}`}>{trainAcc}%</span></>
              )}
            </div>

            {!revealed && (
              <>
                <label className="ch1-slider-label mono">
                  SLOPE: {slope.toFixed(2)}
                  <input type="range" min="-2" max="3" step="0.05"
                    value={slope} onChange={e => setSlope(+e.target.value)} />
                </label>
                <label className="ch1-slider-label mono">
                  INTERCEPT: {intercept.toFixed(2)}
                  <input type="range" min="-0.5" max="1.5" step="0.02"
                    value={intercept} onChange={e => setIntercept(+e.target.value)} />
                </label>

                <div className="ch1-legend mono">
                  <span className="dot blue" /> HIRED &nbsp;
                  <span className="dot red" /> REJECTED
                </div>

                <button className="ch1-deploy-btn mono" onClick={handleDeploy}>
                  [ DEPLOY MODEL ]
                </button>
              </>
            )}

            {revealed && (
              <div className="ch1-reveal-note mono">
                ⚠ Entire cluster rejected.<br />Accuracy collapsed from {trainAcc}% → {realAcc}%
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'reveal-dialogue' && (
        <DialogueBox lines={revealLines} onComplete={handleRevealDialogue} />
      )}

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
