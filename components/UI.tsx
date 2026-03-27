"use client"

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = ({ children, className, hover = true }: GlassCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={cn(
        "bg-card border border-border shadow-lg rounded-2xl p-6 relative overflow-hidden group",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-vital-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </motion.div>
  );
};

export const Button = ({
  children,
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }) => {
  const variants = {
    primary: "bg-vital-green text-white hover:bg-vital-green/90 shadow-lg",
    secondary: "bg-secondary text-foreground border border-border hover:border-vital-green/50",
    outline: "bg-transparent border border-vital-green/30 text-vital-green hover:bg-vital-green/10"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-display font-medium transition-all duration-300 active:scale-95 disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge = ({ children, status }: { children: React.ReactNode, status?: string }) => {
  const colors: Record<string, string> = {
    Stable: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
    Critical: "bg-red-500/20 text-red-600 border-red-500/30",
    Observation: "bg-amber-500/20 text-amber-600 border-amber-500/30",
    Active: "bg-vital-green/20 text-vital-green border-vital-green/30",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-mono border",
      status ? colors[status] : "bg-secondary text-muted-foreground border-border"
    )}>
      {children}
    </span>
  );
};
