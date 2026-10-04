"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export interface ContainerScrollProps {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  containerHeight?: string;
  cardHeight?: string;
  className?: string;
}

export const ContainerScroll = ({
  titleComponent,
  children,
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
  cardHeight,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
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
      {/* ─── Sleek Tablet Bezel Header Bar ─── */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-1 sm:py-1.5 mb-1 sm:mb-1.5 bg-[#001D39] text-white select-none">
        {/* Left: Window Action Dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#EF4444] border border-[#001D39] shadow-xs inline-block" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F59E0B] border border-[#001D39] shadow-xs inline-block" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#10B981] border border-[#001D39] shadow-xs inline-block" />
        </div>

        {/* Center: Tablet Front Camera Sensor */}
        <div className="flex items-center justify-center">
          <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#0A4174] border border-[#49769F]/50 shadow-inner inline-block" />
        </div>

        {/* Right: Ambient Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <div className="w-2.5 h-2.5 rounded-full border border-[#49769F] bg-[#0A4174] hidden sm:block" />
        </div>
      </div>

      {/* ─── Tablet Screen Area ─── */}
      <div className="h-full w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39]/20 relative shadow-inner">
        {children}
      </div>
    </motion.div>
  );
};
