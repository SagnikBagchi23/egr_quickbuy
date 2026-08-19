import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { formatRupeeWhole, formatIndian, formatIndianWhole, getGoldPrice, calcReturns, type Timeframe } from '../utils/format';
import './GoldWidget.css';

interface Props {
  iteration: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  onBuy: (units: number) => void;
}

const PRESETS = [5000, 10000, 25000, 50000];

export function GoldWidget({ iteration, onBuy }: Props) {
  const [price, setPrice] = useState(getGoldPrice);
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');
  const [pressing, setPressing] = useState(false);
  const [unitSize, setUnitSize] = useState<'10mg' | '1g'>('10mg');
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
    if (iteration === 8) {
      setSliderValue(Math.round(price * 50));
    } else if (iteration === 7) {
      setSliderValue(5000);
      setUnitSize('10mg');
    } else if (iteration === 6) {
      setSliderValue(10);
    } else if (mode === 'units') {
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

  // Needle slider drag state (iteration 6)
  const needleRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startValue: number } | null>(null);

  const handleNeedleDown = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startValue: sliderValue };
  }, [sliderValue]);

  const handleNeedleMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dUnits = Math.round(-dx / 8);
    setSliderValue(Math.max(1, Math.min(1000, dragRef.current.startValue + dUnits)));
  }, []);

  const handleNeedleUp = useCallback(() => {
    dragRef.current = null;
  }, []);

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
          {iteration !== 6 && iteration !== 7 && iteration !== 8 && (
            <div className="gold-section__live-tag">
              <div className="gold-section__live-dot" />
              <span className="gold-section__live-label">LIVE</span>
            </div>
          )}
          <div className="gold-section__title">Start saving in 24K Gold</div>
          {iteration === 4 && (
            <div className="gold-section__subtitle">₹{formatIndian(price)} / 10mg</div>
          )}
        </div>
      </div>

      <div className="gold-card" style={iteration === 6 || iteration === 7 || iteration === 8 ? { gap: 32 } : undefined}>
        {iteration === 8 ? (() => {
          const unitPrice8 = price;
          const maxAmt8 = Math.floor(10000 * unitPrice8);
          const minAmt8 = Math.ceil(unitPrice8);
          const wholeUnits8 = Math.floor(sliderValue / unitPrice8);
          const approxReq8 = Math.round(wholeUnits8 * unitPrice8);
          const mockBalance = 2537;
          return (
          <>
            <div className="gold7-section">
              <div className="gold7-qty">
                <span className="gold7-qty__label">AMOUNT</span>
                <span className="gold7-qty__value">₹{formatIndianWhole(approxReq8)}</span>
                {wholeUnits8 > 0 && (
                  <span className="gold8-units-note">{wholeUnits8} × 10mg unit{wholeUnits8 !== 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="gold7-slider-wrap">
                <input
                  type="range"
                  className="gold7-slider"
                  min={minAmt8}
                  max={maxAmt8}
                  step={1}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, var(--goldButtonStop1, #edb537) 0%, var(--goldButtonStop1, #edb537) ${((sliderValue - minAmt8) / (maxAmt8 - minAmt8)) * 100}%, var(--backgroundTertiary) ${((sliderValue - minAmt8) / (maxAmt8 - minAmt8)) * 100}%, var(--backgroundTertiary) 100%)`,
                  }}
                />
              </div>
            </div>
            <div className="gold8-price-row">
              <span className="gold8-price-row__label">GOLD PRICE (10MG)</span>
              <span className="gold8-price-row__value">₹{formatIndian(unitPrice8)}</span>
            </div>
            <div className="needle-section__footer">
              <div className="gold8-balance-row">
                <span className="gold8-balance-row__text">Balance : ₹{formatIndianWhole(mockBalance)}</span>
                <span className="gold8-balance-row__text">
                  Approx req. : <span className="gold8-balance-row__dashed">₹{formatIndianWhole(approxReq8)}</span>
                </span>
              </div>
              <button
                className={`btn-primary btn-primary--md btn-primary--gold ${pressing ? 'btn-primary--pressed' : ''}`}
                onClick={handleBuyClick}
              >
                <svg className="btn-primary__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M9 2L4 9h4l-1 5 5-7H8l1-5z" fill="currentColor" />
                </svg>
                Quick buy
              </button>
            </div>
          </>
          );
        })() : iteration === 7 ? (
          <>
            <div className="gold7-section">
              <div className="gold7-toggle">
                <button
                  className={`gold7-toggle__pill ${unitSize === '10mg' ? 'gold7-toggle__pill--active' : ''}`}
                  onClick={() => {
                    setUnitSize('10mg');
                    setSliderValue(Math.min(sliderValue, 10000));
                  }}
                >
                  10MG
                </button>
                <button
                  className={`gold7-toggle__pill ${unitSize === '1g' ? 'gold7-toggle__pill--active' : ''}`}
                  onClick={() => {
                    setUnitSize('1g');
                    setSliderValue(Math.min(sliderValue, 100));
                  }}
                >
                  1G
                </button>
              </div>
              <div className="gold7-qty">
                <span className="gold7-qty__label">QTY</span>
                <span className="gold7-qty__value">{formatIndianWhole(sliderValue)}</span>
              </div>
              <div className="gold7-slider-wrap">
                <input
                  type="range"
                  className="gold7-slider"
                  min={1}
                  max={unitSize === '10mg' ? 10000 : 100}
                  step={1}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, var(--goldButtonStop1, #edb537) 0%, var(--goldButtonStop1, #edb537) ${((sliderValue - 1) / ((unitSize === '10mg' ? 10000 : 100) - 1)) * 100}%, var(--backgroundTertiary) ${((sliderValue - 1) / ((unitSize === '10mg' ? 10000 : 100) - 1)) * 100}%, var(--backgroundTertiary) 100%)`,
                  }}
                />
              </div>
            </div>
            <div className="needle-section__footer">
              <p className="needle-section__helper">
                Price of {unitSize === '10mg' ? '10mg' : '1g'} gold is ₹{formatIndian(unitSize === '10mg' ? price : price * 100)}
              </p>
              <button
                className={`btn-primary btn-primary--md btn-primary--gold ${pressing ? 'btn-primary--pressed' : ''}`}
                onClick={handleBuyClick}
              >
                <svg className="btn-primary__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M9 2L4 9h4l-1 5 5-7H8l1-5z" fill="currentColor" />
                </svg>
                Quick buy
              </button>
            </div>
          </>
        ) : iteration === 6 ? (
          <>
            <div className="needle-section">
              <div className="needle-section__header">
                <span className="needle-section__label">QTY</span>
                <span className="needle-section__value">{formatIndianWhole(units)}</span>
              </div>
              <div className="needle-section__slider-row">
                <button
                  className="needle-btn"
                  onClick={() => setSliderValue(Math.max(1, sliderValue - 1))}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <div
                  className="needle-slider"
                  ref={needleRef}
                  onPointerDown={handleNeedleDown}
                  onPointerMove={handleNeedleMove}
                  onPointerUp={handleNeedleUp}
                  onPointerCancel={handleNeedleUp}
                >
                  <div className="needle-slider__bars-mask">
                    <div
                      className="needle-slider__bars"
                      style={{
                        width: 1000 * 8,
                        left: `calc(50% - ${(sliderValue - 1) * 8}px)`,
                      }}
                    />
                  </div>
                  <div className="needle-slider__pointer" />
                </div>
                <button
                  className="needle-btn"
                  onClick={() => setSliderValue(Math.min(1000, sliderValue + 1))}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="8" y1="4" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="needle-section__footer">
              <p className="needle-section__helper">
                Price of 10mg gold is ₹{formatIndian(price)}
              </p>
              <button
                className={`btn-primary btn-primary--md btn-primary--gold ${pressing ? 'btn-primary--pressed' : ''}`}
                onClick={handleBuyClick}
              >
                <svg className="btn-primary__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M9 2L4 9h4l-1 5 5-7H8l1-5z" fill="currentColor" />
                </svg>
                Quick buy
              </button>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
