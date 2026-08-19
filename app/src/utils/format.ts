export function formatIndian(num: number): string {
  const fixed = num.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const isNeg = intPart.startsWith('-');
  let digits = isNeg ? intPart.slice(1) : intPart;
  if (digits.length > 3) {
    const last3 = digits.slice(-3);
    const rest = digits.slice(0, -3);
    const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    digits = formatted + ',' + last3;
  }
  return (isNeg ? '-' : '') + digits + '.' + decPart;
}

export function formatRupee(num: number): string {
  return '₹' + formatIndian(num);
}

export function formatRupeeWhole(num: number): string {
  const rounded = Math.round(num);
  const isNeg = rounded < 0;
  let digits = Math.abs(rounded).toString();
  if (digits.length > 3) {
    const last3 = digits.slice(-3);
    const rest = digits.slice(0, -3);
    const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    digits = formatted + ',' + last3;
  }
  return '₹' + (isNeg ? '-' : '') + digits;
}

function generateGoldPrice(): number {
  const base = 150;
  const offset = (Math.random() * 6 - 3);
  return Math.round((base + offset) * 100) / 100;
}

let _currentPrice = generateGoldPrice();
let _lastTick = Date.now();
const TICK_INTERVAL = 3000;

export function getGoldPrice(): number {
  const now = Date.now();
  if (now - _lastTick >= TICK_INTERVAL) {
    const delta = (Math.random() * 0.8 - 0.4);
    _currentPrice = Math.round(Math.max(147, Math.min(153, _currentPrice + delta)) * 100) / 100;
    _lastTick = now;
  }
  return _currentPrice;
}

export const PRICE_PER_UNIT = 150;

export const RETURNS_CONFIG = {
  '1Y': { rate: 0.25, years: 1 },
  '3Y': { rate: 0.18, years: 3 },
  '5Y': { rate: 0.14, years: 5 },
} as const;

export type Timeframe = keyof typeof RETURNS_CONFIG;

export function calcReturns(invested: number, tf: Timeframe): number {
  const { rate, years } = RETURNS_CONFIG[tf];
  return invested * (Math.pow(1 + rate, years) - 1);
}
