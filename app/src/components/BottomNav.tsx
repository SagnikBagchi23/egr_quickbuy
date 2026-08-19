import './BottomNav.css';

interface Tab {
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { label: 'Stocks', icon: 'gh-standard-chart-line-data-02' },
  { label: 'F&O', icon: 'gh-standard-percent-circle' },
  { label: 'Mutual Funds', icon: 'gh-standard-pie-chart-01' },
  { label: 'Pay', icon: 'gh-standard-arrow-right-double' },
];

interface Props {
  activeTab?: string;
  onTabPress?: (label: string) => void;
}

export function BottomNav({ activeTab = 'Stocks', onTabPress }: Props) {
  return (
    <nav className="mds-bottom-nav">
      <div className="mds-bottom-nav__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            className={`mds-bottom-nav__tab ${tab.label === activeTab ? 'mds-bottom-nav__tab--active' : ''}`}
            type="button"
            onClick={() => onTabPress?.(tab.label)}
          >
            <span className="mds-bottom-nav__icon">
              <i className={tab.icon} />
            </span>
            <span className="mds-bottom-nav__label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="mds-bottom-nav__indicator" />
    </nav>
  );
}
