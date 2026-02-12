"use client"

import React from 'react';
import { cn } from "@/lib/utils";

export interface TechCardProps {
  title: string;
  description: string;
  color: string;
  delay: number;
  isVisible: boolean;
  index: number;
  totalCount: number;
  onClick: () => void;
  isSelected: boolean;
}

export const TechCard = React.forwardRef<HTMLDivElement, TechCardProps>(
  ({ title, description, color, delay, isVisible, index, totalCount, onClick, isSelected }, ref) => {
    const middleIndex = (totalCount - 1) / 2;
    const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;
    
    const rotation = factor * 25; 
    const translationX = factor * 85; 
    const translationY = Math.abs(factor) * 12;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-24 h-32 cursor-pointer group/card",
          isSelected && "opacity-0",
        )}
        style={{
          transform: isVisible
            ? `translateY(calc(-100px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.4)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          zIndex: 10 + index,
          left: "-48px",
          top: "-64px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <div 
          className={cn(
            "w-full h-full rounded-lg overflow-hidden shadow-xl border border-white/10 relative",
            "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover/card:-translate-y-6 group-hover/card:shadow-2xl group-hover/card:ring-2 group-hover/card:ring-white/20 group-hover/card:scale-125"
          )}
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
          <div className="p-2.5 h-full flex flex-col justify-between relative z-10">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-tighter text-white leading-tight mb-1.5 line-clamp-2">
                {title}
              </h4>
            </div>
            <p className="text-[7px] text-white/90 leading-tight line-clamp-3 font-medium">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  }
);
TechCard.displayName = "TechCard";
