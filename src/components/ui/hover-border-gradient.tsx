"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export interface HoverBorderGradientProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  containerClassName?: string;
  className?: string;
  innerBgClassName?: string;
  duration?: number;
  clockwise?: boolean;
  highlightColor?: string;
  beamColor?: string;
  borderWidth?: number;
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  innerBgClassName,
  as: Tag = "button",
  duration = 1.5,
  clockwise = true,
  highlightColor = "#00f0ff",
  beamColor = "rgba(123, 189, 232, 0.95)",
  borderWidth = 1.5,
  ...props
}: React.PropsWithChildren<HoverBorderGradientProps>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP: `radial-gradient(20.7% 50% at 50% 0%, ${beamColor} 0%, rgba(255, 255, 255, 0) 100%)`,
    LEFT: `radial-gradient(16.6% 43.1% at 0% 50%, ${beamColor} 0%, rgba(255, 255, 255, 0) 100%)`,
    BOTTOM: `radial-gradient(20.7% 50% at 50% 100%, ${beamColor} 0%, rgba(255, 255, 255, 0) 100%)`,
    RIGHT: `radial-gradient(16.2% 41.2% at 100% 50%, ${beamColor} 0%, rgba(255, 255, 255, 0) 100%)`,
  };

  const highlight = `radial-gradient(75% 181.16% at 50% 50%, ${highlightColor} 0%, rgba(255, 255, 255, 0) 100%)`;

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);

  const hasCustomRadius = containerClassName?.includes("rounded-");
  const hasCustomWidth = containerClassName?.includes("w-");

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex content-center bg-[#001D39]/40 hover:bg-[#001D39]/20 transition duration-500 items-center justify-center overflow-visible p-px decoration-clone",
        !hasCustomRadius && "rounded-full",
        !hasCustomWidth && "w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "text-white z-10 rounded-[inherit] relative",
          !className?.includes("w-") && "w-auto",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit] pointer-events-none"
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1.5 }}
      />
      <div
        className={cn(
          "bg-[#001D39] absolute z-1 flex-none rounded-[inherit] pointer-events-none",
          innerBgClassName
        )}
        style={{ inset: `${borderWidth}px` }}
      />
    </Tag>
  );
}
