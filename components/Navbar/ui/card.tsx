import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }: CardContentProps) {
  return <div className="p-2">{children}</div>;
}
