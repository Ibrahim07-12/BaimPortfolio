"use client";
import React, { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
  pageScroll = false,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
    metadata?: React.ReactNode;
    footer?: React.ReactNode;
  }[];
  contentClassName?: string;
  pageScroll?: boolean;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    ...(pageScroll ? { target: ref } : { container: ref }),
    offset: pageScroll ? ["start start", "end end"] : ["start start", "end start"],
  });
  const cardLength = content.length;
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", `${-80}%`]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (pageScroll) {
      setActiveCard(Math.min(cardLength - 1, Math.floor(latest * cardLength)));
      return;
    }
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "#0f172a", // slate-900
    "#000000", // black
    "#171717", // neutral-900
  ];
  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan-500 to emerald-500
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink-500 to indigo-500
    "linear-gradient(to bottom right, #f97316, #eab308)", // orange-500 to yellow-500
  ];

  const backgroundGradient = linearGradients[activeCard % linearGradients.length];

  if (pageScroll) {
    return (
      <div
        className="achievement-sticky-track"
        ref={ref}
        style={{ height: `${content.length + 1}00svh` }}
      >
        <div className="achievement-sticky-stage">
          <div className="achievement-sticky-media">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard}
                className="achievement-sticky-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24 }}
              >
                {content[activeCard].content}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="achievement-copy-viewport">
            <motion.div className="achievement-copy-track" style={{ y: copyY }}>
              {content.map((item, index) => (
                <article
                  key={item.title}
                  className={cn("achievement-copy achievement-copy-slide", contentClassName)}
                  aria-labelledby={`achievement-title-${index}`}
                >
                  {item.metadata}
                  <h2 id={`achievement-title-${index}`}>{item.title}</h2>
                  <p>{item.description}</p>
                  {item.footer}
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="relative flex h-[30rem] justify-center space-x-10 overflow-y-auto rounded-md p-10"
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-kg mt-10 max-w-sm text-slate-300"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-10 hidden h-60 w-80 overflow-hidden rounded-md bg-white lg:block",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};
