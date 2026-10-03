"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export interface ContainerScrollProps {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  badgeTitle?: string;
  badgeStatus?: string;
  containerHeight?: string;
  cardHeight?: string;
  className?: string;
}

export const ContainerScroll = ({
  titleComponent,
  children,
  badgeTitle = "SIGAP SLATE v2.0 • LIVE TELEMETRY",
  badgeStatus = "AKTIF",
  containerHeight = "h-[48rem] sm:h-[58rem] md:h-[70rem]",
  cardHeight = "h-[28rem] sm:h-[35rem] md:h-[42rem]",
  className = "",
}: ContainerScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this container relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.75, 0.95] : [1.05, 1];
  };

  // Complete rotation from 20deg to 0deg before the end of the scroll container
  // so the user can interact with the flat tablet before scrolling away
  const rotate = useTransform(scrollYProgress, [0, 0.75], [20, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.75],
    mounted ? scaleDimensions() : [1, 1]
  );
  const translate = useTransform(scrollYProgress, [0, 0.75], [0, -50]);

  return (
    <div
      className={`${containerHeight} flex items-center justify-center relative p-1 sm:p-4 md:p-10 ${className}`}
      ref={containerRef}
    >
      <div
        className="py-6 sm:py-10 md:py-20 w-full relative"
        style={{
          perspective: "1200px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card
          rotate={rotate}
          translate={translate}
          scale={scale}
          badgeTitle={badgeTitle}
          badgeStatus={badgeStatus}
          cardHeight={cardHeight}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center px-2 mb-6 sm:mb-8"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  badgeTitle,
  badgeStatus,
  cardHeight,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  badgeTitle: string;
  badgeStatus: string;
  cardHeight: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 25px 60px -15px rgba(0, 29, 57, 0.45), 0 0 0 1px rgba(123, 189, 232, 0.25) inset, 4px 6px 0px #001D39",
        transformStyle: "preserve-3d",
      }}
      className={`max-w-6xl -mt-6 sm:-mt-10 mx-auto ${cardHeight} w-full border-3 sm:border-4 border-[#001D39] p-2 sm:p-3 md:p-4 bg-[#001D39] rounded-[24px] sm:rounded-[32px] md:rounded-[36px] flex flex-col`}
    >
      {/* ─── Tablet Cockpit Chrome Header Bar ─── */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 mb-1.5 sm:mb-2 bg-[#001D39] text-white select-none">
        {/* Left: Window Action Dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#EF4444] border border-[#001D39] shadow-xs inline-block" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F59E0B] border border-[#001D39] shadow-xs inline-block" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#10B981] border border-[#001D39] shadow-xs inline-block" />
        </div>

        {/* Center: Cockpit Telemetry Badge */}
        <div className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-[#0A4174] border border-[#49769F]/40 text-[10px] sm:text-xs font-mono text-[#BDD8E9] flex items-center gap-1.5 sm:gap-2 shadow-inner max-w-[200px] sm:max-w-none truncate">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#10B981] animate-pulse flex-shrink-0" />
          <span className="font-bold tracking-tight truncate">{badgeTitle}</span>
        </div>

        {/* Right: Operational Status Pill */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-[#BDD8E9] text-[#001D39] text-[9px] sm:text-[10px] font-black tracking-wider uppercase border border-[#001D39]">
            {badgeStatus}
          </span>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-[#49769F] bg-[#0A4174] hidden sm:block" />
        </div>
      </div>

      {/* ─── Tablet Screen Area ─── */}
      <div className="h-full w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39]/20 relative shadow-inner">
        {children}
      </div>
    </motion.div>
  );
};
