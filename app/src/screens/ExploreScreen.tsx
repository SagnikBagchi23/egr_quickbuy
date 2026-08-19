import { GoldWidget } from '../components/GoldWidget';
import './ExploreScreen.css';

interface Props {
  iteration: 1 | 2 | 3 | 4 | 5;
  onBuy: (units: number) => void;
}

const WATCHLIST = [
  { name: 'SWIGGY', change: '-0.44%', negative: true },
  { name: 'GOOG', change: '+0.53%', negative: false },
  { name: 'LTF', change: '+2.23%', negative: false },
  { name: 'VISA', change: '-14.52%', negative: true },
  { name: 'AXISBANK', change: '+0.41%', negative: false },
];

export function ExploreContent({ iteration, onBuy }: Props) {
  return (
    <div className="explore-content">
      {/* Watchlist section */}
      <div className="watchlist-section">
        <div className="watchlist-section__header">
          <span className="section-heading">Recently viewed</span>
        </div>
        <div className="watchlist-section__items">
          {WATCHLIST.map((stock) => (
            <div key={stock.name} className="watchlist-item">
              <div className="watchlist-item__logo">
                <span className="watchlist-item__logo-text">
                  {stock.name.slice(0, 2)}
                </span>
              </div>
              <div className="watchlist-item__info">
                <span className="watchlist-item__name">{stock.name}</span>
                <span
                  className="watchlist-item__change"
                  style={{ color: stock.negative ? 'var(--contentNegative)' : 'var(--contentPositive)' }}
                >
                  {stock.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gold widget */}
      <GoldWidget iteration={iteration} onBuy={onBuy} />

      {/* Most traded stub */}
      <div className="most-traded-section">
        <div className="section-heading" style={{ padding: '20px 16px 12px 16px' }}>
          Most traded on Groww
        </div>
        <div className="most-traded-grid">
          {[
            { name: 'Reliance', price: '₹1,298.45', change: '+1.24%', positive: true },
            { name: 'HDFC Bank', price: '₹1,742.30', change: '-0.38%', positive: false },
            { name: 'TCS', price: '₹3,856.10', change: '+0.67%', positive: true },
            { name: 'Infosys', price: '₹1,848.25', change: '+1.12%', positive: true },
          ].map((stock) => (
            <div key={stock.name} className="stock-card">
              <div className="stock-card__logo">
                <span>{stock.name.slice(0, 2)}</span>
              </div>
              <div className="stock-card__name">{stock.name}</div>
              <div className="stock-card__price">{stock.price}</div>
              <div
                className="stock-card__change"
                style={{ color: stock.positive ? 'var(--contentPositive)' : 'var(--contentNegative)' }}
              >
                {stock.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
