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
    primary: "bg-vital-green text-slate-900 hover:bg-emerald-glow shadow-[0_0_20px_rgba(0,212,170,0.3)]",
    secondary: "bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200",
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
    Stable: "bg-emerald-glow/10 text-emerald-glow border-emerald-glow/20",
    Critical: "bg-red-500/10 text-red-500 border-red-500/20",
    Observation: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Active: "bg-vital-green/10 text-vital-green border-vital-green/20",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-mono border",
      status ? colors[status] : "bg-slate-100 text-slate-500 border-slate-200"
    )}>
      {children}
    </span>
  );
};
