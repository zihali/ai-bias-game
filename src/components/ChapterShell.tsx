import type { ReactNode } from 'react';
import './ChapterShell.css';

interface Props {
  chapterNumber: number;
  title: string;
  children: ReactNode;
}

/**
 * Shared wrapper for every chapter – consistent header, background,
 * and content area.  Chapters drop their unique interaction inside.
 */
export default function ChapterShell({ chapterNumber, title, children }: Props) {
  return (
    <section className={`chapter-shell ch-${chapterNumber}`}>
      <header className="chapter-header">
        <span className="chapter-tag">Chapter {chapterNumber}</span>
        <h2 className="chapter-title">{title}</h2>
      </header>
      <div className="chapter-content">{children}</div>
    </section>
  );
}
