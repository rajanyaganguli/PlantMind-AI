import React from 'react';
import './ui.css';

export function Card({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`pm-card ${className}`} {...props}>
      {children}
    </div>
  );
}
