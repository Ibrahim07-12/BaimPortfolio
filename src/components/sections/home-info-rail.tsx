"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Pause } from "lucide-react";

function formatToday() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date()).toUpperCase();
}

export default function HomeInfoRail() {
  const [today, setToday] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);
  const frameRef = useRef<number | null>(null);
  const previousScrollBehaviorRef = useRef<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setToday(formatToday()), 0);
    const dateInterval = window.setInterval(() => setToday(formatToday()), 60_000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(dateInterval);
    };
  }, []);

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    if (previousScrollBehaviorRef.current !== null) {
      document.documentElement.style.scrollBehavior = previousScrollBehaviorRef.current;
    }
  }, []);

  function restoreScrollBehavior() {
    if (previousScrollBehaviorRef.current === null) return;
    document.documentElement.style.scrollBehavior = previousScrollBehaviorRef.current;
    previousScrollBehaviorRef.current = null;
  }

  function stopScroll() {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    restoreScrollBehavior();
    setIsScrolling(false);
  }

  function toggleScroll() {
    if (frameRef.current !== null) {
      stopScroll();
      return;
    }

    const footer = document.getElementById("contact");
    if (!footer) return;

    const startY = window.scrollY;
    const distance = footer.getBoundingClientRect().top;
    if (distance <= 0) return;

    previousScrollBehaviorRef.current = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 1
      : Math.min(18_000, Math.max(5_000, distance * 1.2));
    const startTime = performance.now();
    setIsScrolling(true);

    function animate(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(animate);
      } else {
        frameRef.current = null;
        restoreScrollBehavior();
        setIsScrolling(false);
      }
    }

    frameRef.current = window.requestAnimationFrame(animate);
  }

  return (
    <div className="home-info-rail" aria-label="Informasi portofolio">
      <div className="rail-cell rail-status"><span className="rail-status-dot" /> <span>OPEN TO WORK</span></div>
      <div className="rail-cell">BASED IN BEKASI, INDONESIA</div>
      <div className="rail-cell rail-date"><strong>TODAY:</strong> <time>{today || "-- --- ----"}</time></div>
      <button className="rail-cell rail-scroll" type="button" onClick={toggleScroll} aria-pressed={isScrolling}>
        <span>{isScrolling ? "STOP SCROLL" : "SCROLL DOWN"}</span>
        {isScrolling ? <Pause aria-hidden="true" /> : <ArrowDown aria-hidden="true" />}
      </button>
    </div>
  );
}