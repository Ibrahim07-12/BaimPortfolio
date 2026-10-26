"use client";

import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { StickyScroll } from "@/components/animations/sticky-scroll-reveal";
import achievementBackground from "@/ACHIEVEMENTS/JUDULUTAMA/bgyudis.jpeg";
import achievementPortrait from "@/ACHIEVEMENTS/JUDULUTAMA/meyudis.png";
import achievement1 from "@/ACHIEVEMENTS/sertifikasi/AC1.jpg";
import achievement2 from "@/ACHIEVEMENTS/sertifikasi/AC2.jpg";
import achievement3 from "@/ACHIEVEMENTS/sertifikasi/AC3.png";
import achievement4 from "@/ACHIEVEMENTS/sertifikasi/AC4.jpg";
import achievement5 from "@/ACHIEVEMENTS/sertifikasi/AC5.jpg";
import "@/styles/sections/achievements-section.css";

type Achievement = {
  title: string;
  month: string;
  year: string;
  label: string;
  description: string;
  image: StaticImageData;
};

const achievements: Achievement[] = [
  {
    title: "Awards for Outstanding Students in the Field of Reasoning Yogyakarta State University Year 2025",
    month: "May",
    year: "2025",
    label: "Award",
    description:
      "The Outstanding Student Awards in the Field of Reasoning is a programme organized by Yogyakarta State University to recognize students' achievements in intellectual activities, scientific writing, research, and other forms of academic reasoning.",
    image: achievement1,
  },
  {
    title: "Finalist in the 2024 UPNVJ Electrolympic National Scientific Writing Competition",
    month: "November",
    year: "2024",
    label: "Team Member",
    description:
      "Electrolympic is a competition featuring academic and non-academic events, including scientific writing. Open to all active students, the competition explored the theme of using technology to support sustainable lifestyles in the Society 5.0 era.",
    image: achievement2,
  },
  {
    title: "Third Place in Region 2 of the 2024 Regional Indonesian Flying Robot Contest — VTOL Division",
    month: "August",
    year: "2024",
    label: "Team Member",
    description:
      "The Indonesian Flying Robot Contest (KRTI), organized by the Ministry of Education, Culture, Research, and Technology, challenges university teams to build advanced unmanned aircraft. The 2024 VTOL division tested autonomous long-range missions and indoor flight capabilities.",
    image: achievement3,
  },
  {
    title: "Excellent Team Award in the 2024 National Indonesian Flying Robot Contest — Racing Plane Division",
    month: "September",
    year: "2024",
    label: "Pilot",
    description:
      "The Racing Plane division challenges university teams to design and operate fixed-wing unmanned aircraft in speed-based races, emphasizing flight control, navigation, and precise maneuvering. Results are evaluated by valid course completion and finish time.",
    image: achievement4,
  },
  {
    title: "Participation in the Polines Robot Competition",
    month: "February",
    year: "2024",
    label: "Team Leader",
    description:
      "The Polines Robotic Contest (PRC) is a national robotics competition organized by the Student Activity Unit for Science Development at Semarang State Polytechnic.",
    image: achievement5,
  },
];

export default function AchievementsSection() {
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const achievementsListRef = useRef<HTMLElement>(null);
  const [viewedImage, setViewedImage] = useState<{ image: StaticImageData; alt: string } | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroTrackRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const { scrollYProgress: listProgress } = useScroll({
    target: achievementsListRef,
    offset: ["start 90%", "end 10%"],
  });
  const listOpacity = useTransform(listProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const listY = useTransform(listProgress, [0, 0.25, 0.75, 1], [44, 0, 0, 44]);

  useEffect(() => {
    if (!viewedImage) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewedImage(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [viewedImage]);

  return (
    <section className="achievements-section" id="achievements" aria-label="Achievements">
      <div className="achievements-hero-track" ref={heroTrackRef}>
        <div className="achievements-hero">
          <motion.div className="achievements-hero-background" style={{ y: backgroundY }}>
            <Image
              src={achievementBackground}
              alt=""
              fill
              sizes="100vw"

              className="achievements-background-image"
            />
          </motion.div>
          <div className="achievements-hero-glass" />
          <motion.h1 className="achievements-hero-title" style={{ y: titleY }}>
            ACHIEVEMENTS
          </motion.h1>
          <motion.div className="achievements-hero-portrait" style={{ y: portraitY, scale: 2 }}>
            <Image
              src={achievementPortrait}
              alt="Muhammad Ibrahim at an award ceremony"
              fill
              sizes="(max-width: 760px) 84vw, 58vw"
              className="achievements-portrait-image"
            />
          </motion.div>
        </div>
      </div>

      <motion.section
        className="achievements-list"
        ref={achievementsListRef}
        aria-label="Awards and achievements"
        style={{ opacity: listOpacity, y: listY }}
      >
        <StickyScroll
          pageScroll
          content={achievements.map((achievement, index) => ({
            title: achievement.title,
            description: achievement.description,
            metadata: (
              <div className="achievement-meta">
                <span>{achievement.month}</span>
                <span>{achievement.year}</span>
                <span className="achievement-label">{achievement.label}</span>
              </div>
            ),
            footer: (
              <span className="achievement-number">
                {String(index + 1).padStart(2, "0")} / 05
              </span>
            ),
            content: (
              <button
                className="achievement-photo-button"
                type="button"
                onClick={() => setViewedImage({ image: achievement.image, alt: achievement.title })}
                onDoubleClick={() =>
                  setViewedImage({ image: achievement.image, alt: achievement.title })
                }
                aria-label={`View ${achievement.title} image at full size`}
              >
                <Image
                  src={achievement.image}
                  alt={achievement.title}
                  fill
                  sizes="(max-width: 760px) 90vw, 48vw"
                  className="achievement-photo"
                />
                <span className="achievement-photo-hint">VIEW IMAGE</span>
              </button>
            ),
          }))}
        />
      </motion.section>

      <AnimatePresence>
        {viewedImage && (
          <motion.div
            className="achievement-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setViewedImage(null);
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Achievement image"
          >
            <button
              className="achievement-viewer-close"
              type="button"
              onClick={() => setViewedImage(null)}
              aria-label="Close image"
            >
              <X aria-hidden="true" />
            </button>
            <Image
              src={viewedImage.image}
              alt={viewedImage.alt}
              width={viewedImage.image.width}
              height={viewedImage.image.height}
              sizes="100vw"
              priority
              className="achievement-viewer-image"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
