import { useEffect, useState } from 'react';
import './TitleScreen.css';

interface Props {
  onStart: () => void;
}

const BOOT_LINES = [
  '> AUDITOR OS v2.4.1 — initializing...',
  '> Loading case archive: NovaTech_2019–2021',
  '> WARNING: 3 critical bias incidents detected',
  '> Mounting recovered files...',
  '> Ready. Awaiting investigator.',
];

export default function TitleScreen({ onStart }: Props) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i < BOOT_LINES.length) {
        setVisibleLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
        setTimeout(tick, 420);
      } else {
        setTimeout(() => setReady(true), 300);
      }
    };
    tick();
  }, []);

  return (
    <div className="title-screen">
      <div className="title-boot mono">
        {visibleLines.map((line, idx) => (
          <div key={idx} className="boot-line">{line}</div>
        ))}
      </div>
      {ready && (
        <div className="title-content">
          <h1 className="title-main">The Bias Within</h1>
          <p className="title-sub mono">An interactive investigation into AI bias</p>
          <button className="title-start" onClick={onStart}>
            [ OPEN CASE FILES ]
          </button>
        </div>
      )}
      <footer className="title-footer mono">
        <span>3 Chapters · ~15 min · Auditor OS</span>
      </footer>
    </div>
  );
}
