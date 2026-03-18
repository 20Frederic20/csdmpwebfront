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
        "healing-glass rounded-2xl p-6 relative overflow-hidden group",
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
    primary: "bg-vital-green text-medical-bg hover:bg-emerald-glow shadow-[0_0_20px_rgba(0,212,170,0.3)]",
    secondary: "bg-medical-card text-medical-text border border-vital-green/20 hover:border-vital-green/50",
    outline: "bg-transparent border border-vital-green/30 text-vital-green hover:bg-vital-green/10"
  };

  return (
    <button 
      className={cn(
        "px-6 py-3 rounded-full font-display font-medium transition-all duration-300 active:scale-95 disabled:opacity-50",
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
    Stable: "bg-emerald-glow/20 text-emerald-glow border-emerald-glow/30",
    Critical: "bg-red-500/20 text-red-400 border-red-500/30",
    Observation: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Active: "bg-vital-green/20 text-vital-green border-vital-green/30",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-mono border",
      status ? colors[status] : "bg-medical-card text-medical-muted border-white/10"
    )}>
      {children}
    </span>
  );
};
