import { useState, useEffect, useCallback } from 'react';
import type { DialogueLine } from '../types';
import './DialogueBox.css';

interface Props {
  lines: DialogueLine[];
  onComplete: () => void;
  /** typing speed in ms per character */
  speed?: number;
}

/**
 * Reusable narrative dialogue overlay.
 * Types out each line character-by-character; click / Enter to advance.
 */
export default function DialogueBox({ lines, onComplete, speed = 30 }: Props) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  const current = lines[index];

  /* ── Typewriter effect ── */
  useEffect(() => {
    setDisplayed('');
    setTyping(true);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(current.text.slice(0, i));
      if (i >= current.text.length) {
        clearInterval(id);
        setTyping(false);
      }
    }, speed);
    return () => clearInterval(id);
  }, [index, current.text, speed]);

  /* ── Advance handler ── */
  const advance = useCallback(() => {
    if (typing) {
      // skip to full text
      setDisplayed(current.text);
      setTyping(false);
      return;
    }
    if (index < lines.length - 1) {
      setIndex((i) => i + 1);
    } else {
      onComplete();
    }
  }, [typing, index, lines.length, current.text, onComplete]);

  /* ── Keyboard shortcut ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') advance();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advance]);

  const speakerLabel =
    current.speaker === 'guide'
      ? 'Dr. Aira'
      : current.speaker === 'narrator'
        ? ''
        : 'You';

  return (
    <div className="dialogue-overlay" onClick={advance}>
      <div className="dialogue-box">
        {speakerLabel && (
          <span className={`dialogue-speaker ${current.speaker}`}>
            {speakerLabel}
          </span>
        )}
        <p className="dialogue-text">{displayed}</p>
        {!typing && (
          <span className="dialogue-continue">▼ Click or press Enter</span>
        )}
      </div>
    </div>
  );
}
