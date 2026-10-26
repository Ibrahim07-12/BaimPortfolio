"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import ImageStackCarousel, { type ImageStackCard } from "@/components/animations/image-stack-carousel";
import InversionCircleScrollAnimation from "@/components/animations/inversion-circle-scroll-animation";
import komatsuLogo from "@/WORK/KOMATSU/KOMATSU.png";
import km1 from "@/WORK/KOMATSU/KM1.jpeg";
import km2 from "@/WORK/KOMATSU/KM2.jpeg";
import km3 from "@/WORK/KOMATSU/KM3.jpeg";
import km4 from "@/WORK/KOMATSU/KM4.jpeg";
import km5 from "@/WORK/KOMATSU/KM5.jpeg";
import km6 from "@/WORK/KOMATSU/KM6.jpeg";
import amnsLogo from "@/WORK/AMNS/AMNS.png";
import am1 from "@/WORK/AMNS/AM1.jpeg";
import am2 from "@/WORK/AMNS/AM2.jpeg";
import am3 from "@/WORK/AMNS/AM3.jpeg";
import am4 from "@/WORK/AMNS/AM4.jpeg";
import am5 from "@/WORK/AMNS/AM5.jpeg";
import am6 from "@/WORK/AMNS/AM6.jpeg";
import "@/styles/sections/work-experience-section.css";

const experiences = [
  {
    id: "komatsu",
    company: "PT Komatsu Indonesia",
    period: "JUL – OCT 2025",
    role: "Internship · Foundry Maintenance",
    description:
      "A manufacturing company specializing in heavy equipment for the construction and mining industries.",
    responsibilities:
      "Developed IoT-based smart lighting and spare parts monitoring systems, assembled and tested a thermoelectric generator (TEG) prototype, and implemented a Machine Learning-based predictive maintenance system for the Mainshakeout Regular motor. Also supported field maintenance activities, spare parts warehouse organization, and preparation of training and assessment materials related to foundry machinery and equipment.",
    logo: komatsuLogo,
    photos: [
      { id: "km1", image: km1, alt: "Komatsu Indonesia work photo 1" },
      { id: "km2", image: km2, alt: "Komatsu Indonesia work photo 2" },
      { id: "km3", image: km3, alt: "Komatsu Indonesia work photo 3" },
      { id: "km4", image: km4, alt: "Komatsu Indonesia work photo 4" },
      { id: "km5", image: km5, alt: "Komatsu Indonesia work photo 5" },
      { id: "km6", image: km6, alt: "Komatsu Indonesia work photo 6" },
    ] satisfies ImageStackCard[],
  },
  {
    id: "amns",
    company: "PT AM/NS Indonesia",
    period: "FEB – MAY 2025",
    role: "Internship · Electrical Engineering",
    description:
      "A steel manufacturer producing cold-rolled, galvanized, and annealed steel in sheet and coil form.",
    responsibilities:
      "Analyzed thermocouple sensor functionality in the tube furnace reheating process on the Continuous Galvanizing Line (CGL) and supported electrical maintenance activities, including lighting and steel sheet cutting machine repairs, panel voltage checks, motor drive inspections, and motor lubrication to support reliable plant operations.",
    logo: amnsLogo,
    photos: [
      { id: "am1", image: am1, alt: "AM/NS Indonesia work photo 1" },
      { id: "am2", image: am2, alt: "AM/NS Indonesia work photo 2" },
      { id: "am3", image: am3, alt: "AM/NS Indonesia work photo 3" },
      { id: "am4", image: am4, alt: "AM/NS Indonesia work photo 4" },
      { id: "am5", image: am5, alt: "AM/NS Indonesia work photo 5" },
      { id: "am6", image: am6, alt: "AM/NS Indonesia work photo 6" },
    ] satisfies ImageStackCard[],
  },
];

export default function WorkExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  return (
    <section className="work-experience-section" id="work-experience">
      <InversionCircleScrollAnimation />
      <div className="work-experience-content">
        <div className="work-experience-list" ref={timelineRef}>
          <div className="work-timeline-rail" aria-hidden="true">
            <span className="work-timeline-track" />
            <motion.span className="work-timeline-progress" style={{ scaleY: scrollYProgress }} />
          </div>
          {experiences.map((experience, index) => (
            <WorkExperienceEntry key={experience.id} experience={experience} progress={scrollYProgress} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkExperienceEntry({
  experience,
  progress,
  index,
}: {
  experience: (typeof experiences)[number];
  progress: MotionValue<number>;
  index: number;
}) {
  const entryRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: entryRef, offset: ["start 90%", "end 10%"] });
  const detailsOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const detailsX = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [-32, 0, 0, -32]);
  const galleryOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const galleryX = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [32, 0, 0, 32]);

  return (
    <article className="work-experience-entry" ref={entryRef}>
      <WorkTimelineMarker progress={progress} index={index} />
      <motion.div className="work-experience-details" style={{ opacity: detailsOpacity, x: detailsX }}>
        <div className="work-company-heading">
          <Image src={experience.logo} alt="" className="work-company-logo" sizes="(max-width: 680px) 52px, 68px" />
          <div>
            <p className="work-experience-period">{experience.period}</p>
            <h2>{experience.company}</h2>
            <p className="work-experience-role">{experience.role}</p>
          </div>
        </div>
        <p className="work-experience-description">{experience.description}</p>
        <h3>Key Responsibilities</h3>
        <p className="work-experience-responsibilities">{experience.responsibilities}</p>
      </motion.div>
      <motion.div style={{ opacity: galleryOpacity, x: galleryX }}>
        <ImageStackCarousel cards={experience.photos} label={experience.company} />
      </motion.div>
    </article>
  );
}

function WorkTimelineMarker({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const [reached, setReached] = useState(false);

  useMotionValueEvent(progress, "change", (value) => {
    const threshold = index === 0 ? 0.12 : 0.58;
    const nextReached = value >= threshold;
    setReached((current) => current === nextReached ? current : nextReached);
  });

  return <span className={`work-timeline-marker${reached ? " is-reached" : ""}`} aria-hidden="true" />;
}
