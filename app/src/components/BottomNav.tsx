import './BottomNav.css';

interface Props {
  activeTab?: string;
  onTabPress?: (label: string) => void;
}

const TABS = [
  { label: 'Stocks', icon: 'gh-standard-mds_ic_huge_product_stocks' },
  { label: 'F&O', icon: 'gh-standard-mds_ic_huge_product_fno' },
  { label: 'Mutual Funds', icon: 'gh-standard-mds_ic_huge_product__mf' },
  { label: 'Pay', icon: 'gh-standard-mds_ic_huge_product_pay' },
];

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
            <span className={`mds-bottom-nav__icon ${tab.icon}`} />
            <span className="mds-bottom-nav__label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="mds-bottom-nav__indicator" />
    </nav>
  );
}
