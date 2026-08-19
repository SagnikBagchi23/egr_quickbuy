import './ListRow.css';

interface Props {
  thumbSrc?: string;
  thumbFallback?: string;
  label: string;
  subText?: string;
  trailingValue?: string;
  trailingSub?: string;
  trailingSubColor?: 'positive' | 'negative' | 'neutral';
  showDivider?: boolean;
}

export function ListRow({
  thumbSrc,
  thumbFallback,
  label,
  subText,
  trailingValue,
  trailingSub,
  trailingSubColor = 'neutral',
  showDivider = true,
}: Props) {
  const subColorMap = {
    positive: 'var(--contentPositive)',
    negative: 'var(--contentNegative)',
    neutral: 'var(--contentSecondary)',
  };

  return (
    <div className={`list-row ${showDivider ? 'list-row--divider' : ''}`}>
      {thumbSrc ? (
        <img
          src={thumbSrc}
          alt={label}
          className="list-row__thumb"
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const fallback = img.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
      ) : null}
      {(thumbFallback || thumbSrc) && (
        <div
          className="list-row__thumb-fallback"
          style={{ display: thumbSrc ? 'none' : 'flex' }}
        >
          {thumbFallback || label.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="list-row__middle">
        <span className="list-row__label body-base-heavy">{label}</span>
        {subText && <span className="list-row__sub body-small">{subText}</span>}
      </div>
      {(trailingValue || trailingSub) && (
        <div className="list-row__trailing">
          {trailingValue && (
            <span className="list-row__trailing-value body-base-heavy">{trailingValue}</span>
          )}
          {trailingSub && (
            <span
              className="body-small-heavy"
              style={{ color: subColorMap[trailingSubColor] }}
            >
              {trailingSub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
