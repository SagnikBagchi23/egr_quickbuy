import './PhoneFrame.css';

interface Props {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: Props) {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        {children}
      </div>
    </div>
  );
}
