import { useEffect, useState } from 'react';
import './TransitionScreen.css';

interface Props {
  title: string;
  subtitle?: string;
  /** Auto-dismiss after ms (0 = manual) */
  duration?: number;
  onDone: () => void;
}

/**
 * Full-screen curtain shown between chapters.
 */
export default function TransitionScreen({
  title,
  subtitle,
  duration = 3000,
  onDone,
}: Props) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (duration <= 0) return;
    const t1 = setTimeout(() => setFading(true), duration - 600);
    const t2 = setTimeout(onDone, duration);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [duration, onDone]);

  return (
    <div
      className={`transition-screen ${fading ? 'fade-out' : ''}`}
      onClick={() => { setFading(true); setTimeout(onDone, 500); }}
    >
      <h1 className="transition-title">{title}</h1>
      {subtitle && <p className="transition-subtitle">{subtitle}</p>}
    </div>
  );
}
