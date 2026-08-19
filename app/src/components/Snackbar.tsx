import { useEffect, useState } from 'react';
import './Snackbar.css';

interface Props {
  title: string;
  subtitle?: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function Snackbar({ title, subtitle, visible, onHide, duration = 3000 }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      const showTimer = setTimeout(() => setShow(true), 300);
      const hideTimer = setTimeout(() => {
        setShow(false);
        setTimeout(onHide, 300);
      }, 300 + duration);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setShow(false);
    }
  }, [visible, duration, onHide]);

  if (!visible && !show) return null;

  return (
    <div className={`snackbar ${show ? 'snackbar--visible' : ''}`}>
      <div className="snackbar__icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#04B488" />
          <path d="M6 10.5L8.5 13L14 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="snackbar__copy">
        <span className="snackbar__title">{title}</span>
        {subtitle && <span className="snackbar__subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}
