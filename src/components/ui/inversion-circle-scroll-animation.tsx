"use client";

import { useEffect, useRef, useState } from "react";

const BALL_SIZE = 380;
const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function InversionCircleScrollAnimation() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const measure = () => {
      const width = track.clientWidth;
      const height = window.innerHeight;
      setViewport((current) => (
        current.width === width && current.height === height
          ? current
          : { width, height }
      ));
    };

    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = track.getBoundingClientRect().top + window.scrollY;
        const height = window.innerHeight;
        setProgress(clamp((window.scrollY - top) / height));
      });
    };

    measure();
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("resize", updateProgress);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", measure);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const phaseOne = clamp(progress * 2);
  const phaseTwo = clamp((progress - 0.5) * 2);
  const easedTravel = phaseOne < 0.5
    ? 8 * phaseOne ** 4
    : 1 - (-2 * phaseOne + 2) ** 4 / 2;
  const yOffset = (1 - easedTravel) * (viewport.height / 2 + BALL_SIZE / 2);
  const coverSize = Math.max(viewport.width, viewport.height) * 2.8;
  const ballSize = BALL_SIZE + phaseTwo ** 2 * (coverSize - BALL_SIZE);
  const clipY = viewport.height / 2 + yOffset;
  const titleOpacity = progress < 0.12
    ? progress / 0.12
    : progress > 0.88
      ? (1 - progress) / 0.12
      : 1;
  const titleY = progress < 0.12
    ? (1 - progress / 0.12) * 24
    : progress > 0.88
      ? ((progress - 0.88) / 0.12) * -24
      : 0;

  return (
    <div className="work-inversion-track" ref={trackRef}>
      <div className="work-inversion-hero">
        <div
          className="work-inversion-ball"
          style={{
            width: ballSize,
            height: ballSize,
            transform: `translate(-50%, calc(-50% + ${yOffset}px))`,
          }}
          aria-hidden="true"
        />
        <div className="work-inversion-title" style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
          <h1>WORK EXPERIENCE</h1>
        </div>
        <div
          className="work-inversion-title work-inversion-title-light"
          style={{
            clipPath: `circle(${ballSize / 2}px at ${viewport.width / 2}px ${clipY}px)`,
          }}
          aria-hidden="true"
        >
          <span>WORK EXPERIENCE</span>
        </div>
      </div>
    </div>
  );
}
