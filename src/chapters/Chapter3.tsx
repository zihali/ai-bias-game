import { useState, useCallback, useEffect, useRef } from 'react';
import ChapterShell from '../components/ChapterShell';
import DialogueBox from '../components/DialogueBox';
import RevealOverlay from '../components/RevealOverlay';
import type { DialogueLine } from '../types';
import './Chapter3.css';

interface Props { onComplete: () => void; }

const CASE_DURATION = 5;

interface CaseFile {
  id: number;
  name: string;
  photo: string;
  score: number;
  confidence: number;
  aiVerdict: 'HIGH RISK' | 'LOW RISK';
  actuallyGuilty: boolean;
}

const CASES: CaseFile[] = [
  { id: 1,  name: 'Jordan M.', photo: '🧑‍💼', score: 82, confidence: 94, aiVerdict: 'HIGH RISK', actuallyGuilty: false },
  { id: 2,  name: 'Taylor R.', photo: '👩‍💻', score: 71, confidence: 87, aiVerdict: 'HIGH RISK', actuallyGuilty: false },
  { id: 3,  name: 'Alex K.',   photo: '🧑‍🔬', score: 38, confidence: 76, aiVerdict: 'LOW RISK',  actuallyGuilty: false },
  { id: 4,  name: 'Sam D.',    photo: '👨‍🏫', score: 90, confidence: 97, aiVerdict: 'HIGH RISK', actuallyGuilty: true  },
  { id: 5,  name: 'Casey F.',  photo: '👩‍⚕️', score: 55, confidence: 81, aiVerdict: 'HIGH RISK', actuallyGuilty: false },
  { id: 6,  name: 'Morgan L.', photo: '🧑‍🎤', score: 67, confidence: 89, aiVerdict: 'HIGH RISK', actuallyGuilty: false },
  { id: 7,  name: 'Riley N.',  photo: '👨‍🔧', score: 22, confidence: 64, aiVerdict: 'LOW RISK',  actuallyGuilty: false },
  { id: 8,  name: 'Avery P.',  photo: '👩‍🎨', score: 78, confidence: 92, aiVerdict: 'HIGH RISK', actuallyGuilty: false },
  { id: 9,  name: 'Quinn B.',  photo: '🧑‍💻', score: 85, confidence: 95, aiVerdict: 'HIGH RISK', actuallyGuilty: false },
  { id: 10, name: 'Drew C.',   photo: '👨‍🏭', score: 61, confidence: 83, aiVerdict: 'HIGH RISK', actuallyGuilty: true  },
];

type Decision = 'agree' | 'override';

const introLines: DialogueLine[] = [
  { speaker: 'narrator', text: 'FILE RECOVERED — NovaTech SafeGuard Division | 2020-06-22' },
  { speaker: 'guide', text: 'The model is now used in a human-in-the-loop oversight system. You are the human.', mood: 'neutral' },
  { speaker: 'guide', text: 'Ten case files. Five seconds each. The AI gives a risk verdict. You choose: Agree or Override.', mood: 'serious' },
  { speaker: 'guide', text: 'Trust your gut. The timer starts now.', mood: 'worried' },
];

const revealLines: DialogueLine[] = [
  { speaker: 'guide', text: 'Let us look at what you just did.', mood: 'serious' },
  { speaker: 'guide', text: 'You agreed with a biased AI most of the time. That is Automation Bias.', mood: 'worried' },
  { speaker: 'guide', text: 'When we trust the machine without questioning it, we outsource our moral responsibility. The human loop becomes a rubber stamp.', mood: 'serious' },
];

type Step = 'intro' | 'playing' | 'reveal-dialogue' | 'reveal-card';

export default function Chapter3({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const [caseIdx, setCaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CASE_DURATION);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleIntroComplete = useCallback(() => {
    setStep('playing');
    setTimeLeft(CASE_DURATION);
  }, []);

  const handleRevealDialogue = useCallback(() => setStep('reveal-card'), []);

  const advanceCase = useCallback((decision: Decision) => {
    setDecisions(prev => {
      const next = [...prev, decision];
      if (caseIdx + 1 >= CASES.length) {
        setStep('reveal-dialogue');
      } else {
        setCaseIdx(i => i + 1);
        setTimeLeft(CASE_DURATION);
      }
      return next;
    });
  }, [caseIdx]);

  useEffect(() => {
    if (step !== 'playing') return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          advanceCase('agree');
          return CASE_DURATION;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step, caseIdx, advanceCase]);

  const agrees = decisions.filter(d => d === 'agree').length;
  const overrides = decisions.filter(d => d === 'override').length;
  const wrongAgreements = decisions.filter(
    (d, i) => d === 'agree' && !CASES[i].actuallyGuilty && CASES[i].aiVerdict === 'HIGH RISK'
  ).length;

  const currentCase = CASES[caseIdx];

  return (
    <ChapterShell chapterNumber={3} title="The Human in the Loop">
      {step === 'intro' && (
        <DialogueBox lines={introLines} onComplete={handleIntroComplete} />
      )}

      {step === 'playing' && currentCase && (
        <div className="ch3-layout">
          <div className="ch3-progress mono">CASE {caseIdx + 1} / {CASES.length}</div>
          <div className="ch3-timer-track">
            <div
              className="ch3-timer-fill"
              style={{ width: `${(timeLeft / CASE_DURATION) * 100}%`, background: timeLeft <= 2 ? '#ff5060' : '#4aff91' }}
            />
          </div>
          <div className="ch3-timer-label mono">{timeLeft}s</div>
          <div className={`ch3-case-card ${currentCase.aiVerdict === 'HIGH RISK' ? 'high-risk' : 'low-risk'}`}>
            <div className="ch3-case-photo">{currentCase.photo}</div>
            <div className="ch3-case-info">
              <div className="ch3-case-name mono">{currentCase.name}</div>
              <div className={`ch3-verdict mono ${currentCase.aiVerdict === 'HIGH RISK' ? 'red' : 'green'}`}>
                AI VERDICT: {currentCase.aiVerdict}
              </div>
              <div className="ch3-confidence mono">
                CONFIDENCE: {currentCase.confidence}% | SCORE: {currentCase.score}/100
              </div>
            </div>
          </div>
          <div className="ch3-buttons">
            <button className="ch3-agree mono" onClick={() => advanceCase('agree')}>[ AGREE WITH AI ]</button>
            <button className="ch3-override mono" onClick={() => advanceCase('override')}>[ OVERRIDE AI ]</button>
          </div>
        </div>
      )}

      {step === 'reveal-dialogue' && (
        <DialogueBox lines={revealLines} onComplete={handleRevealDialogue} />
      )}

      {step === 'reveal-card' && (
        <RevealOverlay onDismiss={onComplete}>
          <h3>Automation Bias</h3>
          <div className="ch3-audit-stats mono">
            <div className="ch3-stat">
              <span className="ch3-stat-num">{agrees}</span> / {CASES.length}
              <span className="ch3-stat-label"> times you agreed with the AI</span>
            </div>
            <div className="ch3-stat">
              <span className="ch3-stat-num red">{wrongAgreements}</span>
              <span className="ch3-stat-label"> wrongful HIGH RISK verdicts you endorsed</span>
            </div>
            <div className="ch3-stat">
              <span className="ch3-stat-num">{overrides}</span>
              <span className="ch3-stat-label"> overrides made</span>
            </div>
          </div>
          <p>
            When humans feel time pressure, they defer to the machine.
            The human in the loop becomes a rubber stamp — bias laundered through the appearance of oversight.
          </p>
        </RevealOverlay>
      )}
    </ChapterShell>
  );
}
