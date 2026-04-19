import './RevealOverlay.css';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onDismiss: () => void;
}

/**
 * Full-screen "Reveal" overlay that drops in on top of the chapter
 * to show dramatic results / statistics.
 */
export default function RevealOverlay({ children, onDismiss }: Props) {
  return (
    <div className="reveal-overlay" onClick={onDismiss}>
      <div className="reveal-card" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="reveal-dismiss" onClick={onDismiss}>
          Continue →
        </button>
      </div>
    </div>
  );
}
