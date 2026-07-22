import React from 'react';
import './ui.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'critical' | 'default';
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span className={`pm-badge pm-badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
}
