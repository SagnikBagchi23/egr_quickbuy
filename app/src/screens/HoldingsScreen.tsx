import { useEffect, useState } from 'react';
import { formatRupeeWhole, formatIndian, getGoldPrice } from '../utils/format';
import './HoldingsScreen.css';

interface Props {
  boughtUnits: number;
  buyPrice: number;
}

const MOCK_STOCKS = [
  { name: 'Adani Energy Solutions', shares: 100, price: 913.10, avgBuy: 728.00, change: 2.30, pct: 0.25, positive: true },
  { name: 'Gold 10mg', shares: 0, price: 0, avgBuy: 0, change: 0, pct: 0, positive: true, isGold: true },
  { name: 'Bajaj Finance Ltd', shares: 100, price: 9172.00, avgBuy: 7340.00, change: -16.50, pct: 0.18, positive: false },
  { name: 'Bajaj Holdings & Inv', shares: 100, price: 13082.00, avgBuy: 10465.00, change: 452.00, pct: 3.58, positive: true },
  { name: 'Coal India', shares: 50, price: 420.50, avgBuy: 336.00, change: -3.20, pct: 0.76, positive: false },
  { name: 'Infosys', shares: 100, price: 1848.25, avgBuy: 1478.00, change: 12.30, pct: 0.67, positive: true },
  { name: 'Advance Metering Technology', shares: 100, price: 8200.00, avgBuy: 6560.00, change: 0, pct: 0, positive: true },
  { name: 'McLeod Russel', shares: 100, price: 45.30, avgBuy: 36.00, change: 0, pct: 0, positive: true },
  { name: 'Jio Finance', shares: 50, price: 342.55, avgBuy: 274.00, change: 0, pct: 0, positive: true },
  { name: 'State Bank of India', shares: 50, price: 812.40, avgBuy: 650.00, change: 0, pct: 0, positive: true },
  { name: 'Swiggy', shares: 50, price: 428.60, avgBuy: 343.00, change: 0, pct: 0, positive: true },
  { name: 'Zomato', shares: 41, price: 263.75, avgBuy: 211.00, change: 0, pct: 0, positive: true },
];

export function HoldingsContent({ boughtUnits, buyPrice }: Props) {
  const [goldPrice, setGoldPrice] = useState(getGoldPrice);

  useEffect(() => {
    const id = setInterval(() => setGoldPrice(getGoldPrice()), 3000);
    return () => clearInterval(id);
  }, []);

  const goldCurrentValue = boughtUnits * goldPrice;
  const goldInvested = boughtUnits * buyPrice;
  const goldDayChange = goldCurrentValue - goldInvested;
  const goldDayPct = goldInvested > 0 ? ((goldDayChange / goldInvested) * 100) : 0;

  const nonGoldStocks = MOCK_STOCKS.filter(s => !s.isGold);
  const mockStockTotal = nonGoldStocks.reduce((sum, s) => sum + s.shares * s.price, 0);
  const mockStockInvested = nonGoldStocks.reduce((sum, s) => sum + s.shares * s.avgBuy, 0);
  const totalHoldings = mockStockTotal + goldCurrentValue;
  const totalInvested = mockStockInvested + goldInvested;
  const totalReturns = totalHoldings - totalInvested;
  const totalReturnsPct = totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0;
  const mock1DReturn = nonGoldStocks.reduce((sum, s) => sum + s.shares * s.change, 0) + goldDayChange;
  const mock1DPct = totalHoldings > 0 ? ((mock1DReturn / totalHoldings) * 100) : 0;

  const holdingsCount = nonGoldStocks.length + (boughtUnits > 0 ? 1 : 0);

  const allStocks = MOCK_STOCKS.map(s => {
    if (s.isGold) {
      if (boughtUnits <= 0) return null;
      return {
        name: 'Gold 10mg',
        sharesLabel: `${boughtUnits} qty`,
        price: formatRupeeWhole(goldCurrentValue),
        changeText: `${goldDayChange >= 0 ? '+' : ''}${formatIndian(goldDayChange)} (${Math.abs(goldDayPct).toFixed(2)}%)`,
        positive: goldDayChange >= 0,
      };
    }
    return {
      name: s.name,
      sharesLabel: `${s.shares} qty`,
      price: `₹${formatIndian(s.price)}`,
      changeText: s.change !== 0
        ? `${s.positive ? '+' : '-'}${formatIndian(Math.abs(s.change))} (${s.pct.toFixed(2)}%)`
        : `₹${formatIndian(s.price)}`,
      positive: s.positive,
      hasChange: s.change !== 0,
    };
  }).filter(Boolean) as Array<{
    name: string;
    sharesLabel: string;
    price: string;
    changeText: string;
    positive: boolean;
    hasChange?: boolean;
  }>;

  return (
    <div className="holdings-content">
      {/* Filter pills */}
      <div className="holdings-pills">
        <span className="holdings-pill holdings-pill--active">STOCKS</span>
        <span className="holdings-pill">US STOCKS</span>
        <span className="holdings-pill">BONDS</span>
      </div>

      {/* Summary card */}
      <div className="holdings-summary">
        <div className="holdings-summary__header">
          <div className="holdings-summary__info">
            <span className="holdings-summary__label">HOLDINGS ({holdingsCount})</span>
            <span className="holdings-summary__value">{formatRupeeWhole(totalHoldings)}</span>
          </div>
          <div className="holdings-summary__eye">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="var(--contentSecondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="12" cy="12.5" r="3" stroke="var(--contentSecondary)" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
        </div>
        <div className="holdings-summary__divider" />
        <div className="holdings-summary__stats">
          <div className="holdings-summary__row">
            <span className="holdings-summary__stat-label">1D returns</span>
            <span className={`holdings-summary__stat-value ${mock1DReturn >= 0 ? 'holdings-summary__stat-value--pos' : 'holdings-summary__stat-value--neg'}`}>
              {mock1DReturn >= 0 ? '+' : '-'}₹{formatIndian(Math.abs(mock1DReturn))} ({Math.abs(mock1DPct).toFixed(2)}%)
            </span>
          </div>
          <div className="holdings-summary__row">
            <span className="holdings-summary__stat-label">Total returns</span>
            <span className={`holdings-summary__stat-value ${totalReturns >= 0 ? 'holdings-summary__stat-value--pos' : 'holdings-summary__stat-value--neg'}`}>
              {totalReturns >= 0 ? '+' : '-'}₹{formatIndian(Math.abs(totalReturns))} ({Math.abs(totalReturnsPct).toFixed(2)}%)
            </span>
          </div>
          <div className="holdings-summary__row">
            <span className="holdings-summary__stat-label">Invested</span>
            <span className="holdings-summary__stat-value">{formatRupeeWhole(totalInvested)}</span>
          </div>
        </div>
      </div>

      {/* Sort row */}
      <div className="holdings-sort-row">
        <button className="holdings-sort-row__icon-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 6H17M5 10H15M7 14H13" stroke="var(--contentSecondary)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="holdings-sort-row__tertiary-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5.5 10L8 12.5L10.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.5 6L8 3.5L10.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Market price (10%)</span>
        </button>
      </div>

      {/* Stock list */}
      <div className="holdings-list">
        {allStocks.map((stock, i) => (
          <div key={stock.name + i} className="holdings-item">
            <div className="holdings-item__row">
              <div className="holdings-item__left">
                <div className="holdings-item__info">
                  <span className="holdings-item__name">{stock.name}</span>
                  <span className="holdings-item__shares">{stock.sharesLabel}</span>
                </div>
              </div>
              <div className="holdings-item__right">
                <span className="holdings-item__price">{stock.price}</span>
                <span className={`holdings-item__change ${
                  stock.hasChange === false
                    ? ''
                    : stock.positive ? 'holdings-item__change--pos' : 'holdings-item__change--neg'
                }`}>
                  {stock.changeText}
                </span>
              </div>
            </div>
            {i < allStocks.length - 1 && <div className="holdings-item__divider" />}
          </div>
        ))}
      </div>
    </div>
  );
}
