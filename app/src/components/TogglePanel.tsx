import './TogglePanel.css';

interface Props {
  iteration: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  onIterationChange: (iteration: 1 | 2 | 3 | 4 | 5 | 6 | 7) => void;
}

const ITERATIONS: { n: 1 | 2 | 3 | 4 | 5 | 6 | 7; desc: string }[] = [
  { n: 1, desc: 'Unit slider with returns' },
  { n: 2, desc: 'Amount presets & chips' },
  { n: 3, desc: 'Timeframe below slider' },
  { n: 4, desc: 'Full breakdown & returns' },
  { n: 5, desc: 'With gold price display' },
  { n: 6, desc: 'Needle slider' },
  { n: 7, desc: 'Gold slider with unit toggle' },
];

export function TogglePanel({ iteration, onIterationChange }: Props) {
  return (
    <div className="toggle-panel">
      <div className="toggle-panel__title">Iterations</div>
      <div className="toggle-panel__tabs">
        {ITERATIONS.map(({ n, desc }) => (
          <button
            key={n}
            className={`toggle-panel__tab ${iteration === n ? 'toggle-panel__tab--active' : ''}`}
            onClick={() => onIterationChange(n)}
          >
            <span className="toggle-panel__tab-title">Iteration {n}</span>
            <span className="toggle-panel__tab-desc">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
