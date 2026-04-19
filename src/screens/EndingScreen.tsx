import './EndingScreen.css';

interface Props {
  onRestart: () => void;
}

export default function EndingScreen({ onRestart }: Props) {
  return (
    <div className="ending-screen">
      <h1>Thank you for playing.</h1>
      <p className="ending-sub">
        AI bias isn't a bug—it's a mirror. It reflects the data we feed it,
        the contexts we ignore, and the trust we misplace.
      </p>
      <button className="title-start" onClick={onRestart}>
        Play Again
      </button>
    </div>
  );
}
