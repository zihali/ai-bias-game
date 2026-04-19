import type { ReactNode } from 'react';
import './CharacterSprite.css';

interface Props {
  mood?: 'neutral' | 'happy' | 'serious' | 'surprised' | 'worried';
  /** Horizontal position on screen */
  position?: 'left' | 'center' | 'right';
  visible?: boolean;
  children?: ReactNode;
}

/**
 * Reusable character display – shows the guide avatar.
 * For now renders a stylized placeholder; swap in a real sprite later.
 */
export default function CharacterSprite({
  mood = 'neutral',
  position = 'left',
  visible = true,
}: Props) {
  if (!visible) return null;

  const moodEmoji: Record<string, string> = {
    neutral: '🤖',
    happy: '😊',
    serious: '🧐',
    surprised: '😲',
    worried: '😟',
  };

  return (
    <div className={`character-sprite pos-${position}`}>
      <div className={`sprite-body mood-${mood}`}>
        <span className="sprite-face">{moodEmoji[mood]}</span>
        <span className="sprite-label">Dr. Aira</span>
      </div>
    </div>
  );
}
