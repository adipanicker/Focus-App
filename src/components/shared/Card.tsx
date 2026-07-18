interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-white/6 bg-neutral-800/70 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)] ${className}`}
    >
      {children}
    </div>
  );
}
