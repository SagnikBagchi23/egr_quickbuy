import { useState, useCallback, useEffect, useMemo } from 'react';
import { formatRupeeWhole, formatIndian, getGoldPrice, calcReturns, type Timeframe } from '../utils/format';
import './GoldWidget.css';

interface Props {
  iteration: 1 | 2 | 3 | 4 | 5;
  onBuy: (units: number) => void;
}

const PRESETS = [5000, 10000, 25000, 50000];

export function GoldWidget({ iteration, onBuy }: Props) {
  const [price, setPrice] = useState(getGoldPrice);
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');
  const [pressing, setPressing] = useState(false);
  const mode = iteration === 2 ? 'amount' : 'units';

  const minUnits = Math.ceil(1000 / price);
  const maxUnits = Math.floor(100000 / price);
  const defaultUnits = Math.max(minUnits, Math.min(Math.round(10000 / price), maxUnits));

  const [sliderValue, setSliderValue] = useState(
    mode === 'units' ? defaultUnits : Math.max(1000, Math.round(Math.floor(10000 / price) * price))
  );

  useEffect(() => {
    const id = setInterval(() => setPrice(getGoldPrice()), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (mode === 'units') {
      const min = Math.ceil(1000 / price);
      const max = Math.floor(100000 / price);
      setSliderValue(Math.max(min, Math.min(Math.round(10000 / price), max)));
    } else {
      setSliderValue(Math.max(1000, Math.round(Math.floor(10000 / price) * price)));
    }
    setTimeframe('1Y');
  }, [iteration]);

  const stepPrice = Math.round(price * 100) / 100;
  const units = mode === 'units'
    ? sliderValue
    : Math.max(1, Math.floor(sliderValue / stepPrice));
  const invested = Math.round(units * price * 100) / 100;
  const returns = useMemo(() => calcReturns(invested, timeframe), [invested, timeframe]);
  const totalValue = invested + returns;
  const returnPct = invested > 0 ? ((returns / invested) * 100).toFixed(2) : '0.00';

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  }, []);

  const handlePreset = useCallback((amount: number) => {
    const snapped = Math.floor(amount / price) * price;
    setSliderValue(Math.round(Math.max(1000, snapped)));
  }, [price]);

  const handleBuyClick = useCallback(() => {
    setPressing(true);
    setTimeout(() => {
      setPressing(false);
      onBuy(units);
    }, 200);
  }, [onBuy, units]);

  const sliderMin = mode === 'units' ? minUnits : 1000;
  const sliderMax = mode === 'units' ? maxUnits : 100000;
  const sliderStep = mode === 'units' ? 1 : Math.round(price * 100) / 100;
  const sliderPercent = ((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100;

  const useLargeBtn = iteration === 3 || iteration === 4 || iteration === 5;
  const useMediumBtn = iteration === 2;

  const timeframePills = (
    <div className="gold-card__timeframe-pills">
      {(['1Y', '3Y', '5Y'] as const).map((tf) => (
        <button
          key={tf}
          className={`tf-pill ${timeframe === tf ? 'tf-pill--active' : ''}`}
          onClick={() => setTimeframe(tf)}
        >
          {tf}
        </button>
      ))}
    </div>
  );

  return (
    <div className="gold-section">
      <div className="gold-section__header">
        <div className="gold-section__titles">
          <div className="gold-section__live-tag">
            <div className="gold-section__live-dot" />
            <span className="gold-section__live-label">LIVE</span>
          </div>
          <div className="gold-section__title">Start saving in 24K Gold</div>
          {iteration === 4 && (
            <div className="gold-section__subtitle">₹{formatIndian(price)} / 10mg</div>
          )}
        </div>
      </div>

      <div className="gold-card">
        {(iteration === 4 || iteration === 5) && timeframePills}

        <div className="gold-card__top">
          <div className="gold-card__header">
            <div className="gold-card__col">
              <span className="gold-card__label">YOU INVEST</span>
              <span className="gold-card__value">{formatRupeeWhole(invested)}</span>
              {(iteration === 4 || iteration === 5) && (
                <span className="gold-card__subtext">{units} share{units !== 1 ? 's' : ''}</span>
              )}
            </div>
            <div className="gold-card__chevrons">
              <i className="gh-standard-chevron-right" />
              <i className="gh-standard-chevron-right" />
            </div>
            <div className="gold-card__col gold-card__col--right">
              <span className="gold-card__label">YOU WOULD GET</span>
              <span className="gold-card__value gold-card__value--positive">{formatRupeeWhole(totalValue)}</span>
              {(iteration === 4 || iteration === 5) && (
                <span className="gold-card__subtext gold-card__subtext--positive">
                  +{returnPct}%{' '}
                  <span style={{ color: 'var(--contentSecondary)', fontWeight: 400 }}>returns</span>
                </span>
              )}
            </div>
          </div>

          <div className="gold-card__slider-wrap">
            {mode === 'amount' && (
              <div className="preset-chips" style={{ marginBottom: 12 }}>
                {PRESETS.map((amt) => {
                  const snapped = Math.round(Math.floor(amt / price) * price);
                  const isSelected = Math.abs(sliderValue - snapped) < 1;
                  return (
                    <button
                      key={amt}
                      className={`mds-pill ${isSelected ? 'mds-pill--selected' : ''}`}
                      onClick={() => handlePreset(amt)}
                    >
                      <span className="mds-pill__label">
                        ₹{amt >= 1000 ? `${(amt / 1000).toFixed(0)}K` : amt}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            <input
              type="range"
              className="gold-slider"
              min={sliderMin}
              max={sliderMax}
              step={sliderStep}
              value={sliderValue}
              onChange={handleSlider}
              style={{
                background: `linear-gradient(to right, var(--borderAccent) 0%, var(--borderAccent) ${sliderPercent}%, var(--backgroundTertiary) ${sliderPercent}%, var(--backgroundTertiary) 100%)`,
              }}
            />
          </div>

        </div>

        {iteration === 3 && (
          <>
            <div className="gold-card__disclaimer">
              Returns are absolute and based on past data
            </div>
            {timeframePills}
          </>
        )}

        {iteration === 5 && (
          <div className="gold-card__price-tag">
            <span className="gold-card__price-tag-label">GOLD PRICE (10MG)</span>
            <span className="gold-card__price-tag-value">₹{formatIndian(price)}</span>
          </div>
        )}

        <div className={(iteration === 4 || iteration === 5) ? 'gold-card__footer' : 'gold-card__cta-group'}>
          {mode === 'amount' && (
            <div className="units-note" style={{ textAlign: 'center' }}>
              You'll buy <strong>{units}</strong> unit{units !== 1 ? 's' : ''} at ₹{formatIndian(price)}/unit
            </div>
          )}
          <button
            className={`btn-primary ${useLargeBtn ? 'btn-primary--lg' : ''} ${useMediumBtn ? 'btn-primary--md' : ''} ${pressing ? 'btn-primary--pressed' : ''}`}
            onClick={handleBuyClick}
          >
            Quick buy
          </button>

          {(iteration === 4 || iteration === 5) && (
            <div className="gold-card__disclaimer">
              Returns are absolute and based on past data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
