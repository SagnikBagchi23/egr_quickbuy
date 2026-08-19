import { useState, useCallback } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { TogglePanel } from './components/TogglePanel';
import { StatusBar } from './components/StatusBar';
import { TabsBar } from './components/TabsBar';
import { BottomNav } from './components/BottomNav';
import { Snackbar } from './components/Snackbar';
import { ExploreContent } from './screens/ExploreScreen';
import { HoldingsContent } from './screens/HoldingsScreen';
import { getGoldPrice } from './utils/format';
import './index.css';

type Tab = 'Explore' | 'Holdings';

const INDICES = [
  { name: 'NIFTY50', value: '25,953.85', change: '+0.29%', positive: true },
  { name: 'SENSEX', value: '84,233.64', change: '-0.31%', positive: false },
  { name: 'BANKNIFTY', value: '54,233.64', change: '-0.31%', positive: false },
];

function App() {
  const [iteration, setIteration] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [activeTab, setActiveTab] = useState<Tab>('Explore');
  const [boughtUnits, setBoughtUnits] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleBuy = useCallback((units: number) => {
    setBoughtUnits(units);
    setBuyPrice(getGoldPrice());
    setTimeout(() => {
      setActiveTab('Holdings');
      setTimeout(() => {
        setSnackbarVisible(true);
      }, 450);
    }, 200);
  }, []);

  const handleTabPress = useCallback((tab: string) => {
    setActiveTab(tab as Tab);
    if (tab === 'Explore') {
      setSnackbarVisible(false);
    }
  }, []);

  const handleSnackbarHide = useCallback(() => {
    setSnackbarVisible(false);
  }, []);

  return (
    <>
      <TogglePanel iteration={iteration} onIterationChange={setIteration} />
      <PhoneFrame>
        {/* Shared chrome — stays fixed */}
        <StatusBar />

        {/* App bar */}
        <div className="app-bar">
          <div className="app-bar__logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" stroke="#04B488" strokeWidth="2" />
              <path d="M7 12.5L10.5 16L17 9" stroke="#04B488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="app-bar__title">Stocks</span>
          <div className="app-bar__actions">
            <span className="app-bar__icon-btn"><i className="gh-standard-search-01" /></span>
            <span className="app-bar__icon-btn"><i className="gh-standard-qr-code" /></span>
            <span className="app-bar__avatar">SB</span>
          </div>
        </div>

        {/* Indices strip — shared across tabs */}
        <div className="indices-strip">
          {INDICES.map((idx) => (
            <div key={idx.name} className="indices-strip__item">
              <span className="indices-strip__name">{idx.name}</span>
              <span className="indices-strip__value">{idx.value}</span>
              <span className={`indices-strip__tag ${idx.positive ? 'indices-strip__tag--pos' : 'indices-strip__tag--neg'}`}>
                {idx.change}
              </span>
            </div>
          ))}
        </div>

        {/* Shared tabs bar */}
        <TabsBar activeTab={activeTab} onTabPress={handleTabPress} />

        {/* Content area — only this slides */}
        <div className="tab-content-wrapper">
          <div
            className="tab-content-slider"
            style={{ transform: activeTab === 'Holdings' ? 'translateX(-50%)' : 'translateX(0)' }}
          >
            <div className="tab-content-pane">
              <ExploreContent iteration={iteration} onBuy={handleBuy} />
            </div>
            <div className="tab-content-pane">
              <HoldingsContent
                boughtUnits={boughtUnits}
                buyPrice={buyPrice}
              />
            </div>
          </div>
        </div>

        {/* Shared bottom nav */}
        <BottomNav activeTab="Stocks" />

        {/* Snackbar overlay */}
        <Snackbar
          title="Gold bought successfully!"
          subtitle={`${boughtUnits} share${boughtUnits !== 1 ? 's' : ''} • GOLD10MG999`}
          visible={snackbarVisible}
          onHide={handleSnackbarHide}
        />
      </PhoneFrame>
    </>
  );
}

export default App;
