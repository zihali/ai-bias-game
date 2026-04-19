import './TitleScreen.css';

interface Props {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: Props) {
  return (
    <div className="title-screen">
      <div className="title-content">
        <h1 className="title-main">The Bias Within</h1>
        <p className="title-sub">An interactive journey into AI bias</p>
        <button className="title-start" onClick={onStart}>
          Begin
        </button>
      </div>
      <footer className="title-footer">
        <span>3 Chapters · ~15 min</span>
      </footer>
    </div>
  );
}
