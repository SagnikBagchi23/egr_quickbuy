import './TabsBar.css';

const TABS = ['Explore', 'Holdings', 'Positions', 'Orders'];

interface Props {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

export function TabsBar({ activeTab = 'Explore', onTabPress }: Props) {
  return (
    <div className="tabs-bar">
      {TABS.map((tab) => (
        <button
          key={tab}
          className={`tabs-bar__tab ${tab === activeTab ? 'tabs-bar__tab--active' : ''}`}
          type="button"
          onClick={() => onTabPress?.(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
