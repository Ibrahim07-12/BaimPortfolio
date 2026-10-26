"use client";

import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import JumpingTextInstagram from "@/components/animations/jumping-text-instagram";
import { imagesRevealCardVariants } from "@/components/animations/images-reveal";
import roboticsLogo from "@/Organisasi/ROBOTIK/UNY Robotics.png";
import rk1 from "@/Organisasi/ROBOTIK/RK1.jpeg";
import rk2 from "@/Organisasi/ROBOTIK/RK2.jpeg";
import rk3 from "@/Organisasi/ROBOTIK/RK3.jpeg";
import rk4 from "@/Organisasi/ROBOTIK/RK4.jpeg";
import rk5 from "@/Organisasi/ROBOTIK/RK5.jpeg";
import roboticsProfile from "@/Organisasi/ROBOTIK/PP ROBOTIK.png";
import hmveLogo from "@/Organisasi/HMVE/HMVE.png";
import hm1 from "@/Organisasi/HMVE/HM1.jpeg";
import hm2 from "@/Organisasi/HMVE/HM2.jpeg";
import hm3 from "@/Organisasi/HMVE/HM3.jpeg";
import hm4 from "@/Organisasi/HMVE/HM4.jpeg";
import hm5 from "@/Organisasi/HMVE/HM5.jpeg";
import hmveProfile from "@/Organisasi/HMVE/PP HMVE.png";
import "@/styles/sections/organizational-experience-section.css";

interface Organization {
  id: string;
  number: string;
  name: string;
  logo: StaticImageData;
  profile: StaticImageData;
  role: string;
  period: string;
  introduction: string;
  responsibilities: string[];
  photos: { image: StaticImageData; alt: string }[];
}

const organizations: Organization[] = [
  {
    id: "uny-robotics",
    number: "01",
    name: "UNY Robotics",
    logo: roboticsLogo,
    profile: roboticsProfile,
    role: "Electronics & Pilot",
    period: "November 2023 — February 2025",
    introduction:
      "A robotics-focused division of the Engineering Technology Student Club, where students build and compete with technology-driven machines.",
    responsibilities: [
      "Designed robot electronics by selecting, assembling, and integrating the components each system needed.",
      "Tested circuits, traced faults, and resolved issues to keep robots reliable during development.",
      "Operated and piloted robots in competition, turning technical preparation into precise field performance.",
    ],
    photos: [
      { image: rk1, alt: "UNY Robotics activity photo 1" },
      { image: rk2, alt: "UNY Robotics activity photo 2" },
      { image: rk3, alt: "UNY Robotics activity photo 3" },
      { image: rk4, alt: "UNY Robotics activity photo 4" },
      { image: rk5, alt: "UNY Robotics activity photo 5" },
    ],
  },
  {
    id: "hmve-uny",
    number: "02",
    name: "HMVE UNY",
    logo: hmveLogo,
    profile: hmveProfile,
    role: "Staff Science & Technology Division",
    period: "June 2023 — December 2023",
    introduction:
      "The student association for Electrical and Electronics Engineering, supporting academic growth, student aspirations, and a connected campus community.",
    responsibilities: [
      "Prepared practical, in-depth engineering learning materials for the association’s social media channels.",
      "Helped coordinate industry visits with travel providers and tracked student participation.",
      "Sourced workshop speakers and operated event technology for a programme on AI in industrial automation.",
      "Supported the Personnel Division in introducing campus life to incoming students.",
    ],
    photos: [
      { image: hm1, alt: "HMVE UNY activity photo 1" },
      { image: hm2, alt: "HMVE UNY activity photo 2" },
      { image: hm3, alt: "HMVE UNY activity photo 3" },
      { image: hm4, alt: "HMVE UNY activity photo 4" },
      { image: hm5, alt: "HMVE UNY activity photo 5" },
    ],
  },
];

function OrganizationGallery({
  organization,
  isActive,
}: {
  organization: Organization;
  isActive: boolean;
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<Organization["photos"][number] | null>(null);
  const cardAngles = ["-8deg", "6deg", "-4deg", "8deg", "-6deg"];

  useEffect(() => {
    if (!selectedPhoto) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedPhoto]);

  const viewer = selectedPhoto && typeof document !== "undefined"
    ? createPortal(
        <AnimatePresence>
          <motion.div
            className="organization-viewer-backdrop"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedPhoto(null);
            }}
          >
            <motion.div
              className="organization-viewer"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedPhoto.alt} full-size photo`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
            >
              <button
                type="button"
                className="organization-viewer-close"
                aria-label="Close full-size photo"
                onClick={() => setSelectedPhoto(null)}
              >
                <span aria-hidden="true">×</span>
              </button>
              <Image
                src={selectedPhoto.image}
                alt={selectedPhoto.alt}
                width={selectedPhoto.image.width}
                height={selectedPhoto.image.height}
                sizes="100vw"
                className="organization-viewer-image"
                priority
              />
              <p>{selectedPhoto.alt} · {selectedPhoto.image.width} × {selectedPhoto.image.height}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <>
      <div className="organization-gallery" aria-label={`${organization.name} photos`}>
        {organization.photos.map((photo, index) => (
          <motion.button
            key={photo.alt}
            type="button"
            className="organization-photo"
            custom={{ index, angle: cardAngles[index] }}
            initial="hidden"
            animate={isActive ? "visible" : "hidden"}
            variants={imagesRevealCardVariants}
            aria-label={`${photo.alt}. Double click to view full size.`}
            onDoubleClick={() => setSelectedPhoto(photo)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedPhoto(photo);
              }
            }}
            whileHover={{
              scale: 1.08,
              rotate: "0deg",
              y: -5,
              zIndex: 20,
              transition: { duration: 0.3, type: "spring", stiffness: 150, damping: 20 },
            }}
            whileFocus={{
              scale: 1.08,
              rotate: "0deg",
              y: -5,
              zIndex: 20,
            }}
          >
            <Image
              src={photo.image}
              alt={photo.alt}
              fill
              sizes="(max-width: 650px) 46vw, (max-width: 1000px) 30vw, 20vw"
              className="organization-photo-image"
            />
            <span className="organization-photo-number">{String(index + 1).padStart(2, "0")}</span>
          </motion.button>
        ))}
      </div>

      {viewer}
    </>
  );
}

function OrganizationExperience({
  organization,
  scale,
  rotate,
  y,
  opacity,
  burnProgress,
  layer,
}: {
  organization: Organization;
  scale: MotionValue<number>;
  rotate: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  burnProgress: MotionValue<string>;
  layer: number;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(() => opacity.get() > 0.5);

  useMotionValueEvent(burnProgress, "change", (latest) => {
    panelRef.current?.style.setProperty("--organization-burn", latest);
  });

  useMotionValueEvent(opacity, "change", (latest) => {
    const nextIsActive = latest > 0.5;
    setIsActive((current) => current === nextIsActive ? current : nextIsActive);
  });

  return (
    <motion.article
      className="organization-experience organization-panel"
      id={organization.id}
      ref={panelRef}
      style={{
        scale,
        rotate,
        y,
        opacity,
        zIndex: isActive && organization.id === "hmve-uny" ? layer + 3 : layer,
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div className="organization-experience-content">
        <OrganizationGallery organization={organization} isActive={isActive} />
        <div className="organization-story">
          <div className="organization-heading">
            <div className="organization-identity">
              <motion.div
                className="organization-logo-wrap"
                initial={{ opacity: 0, scale: 0.82, rotate: -6 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 180, damping: 16 }}
              >
                <Image src={organization.logo} alt="" className="organization-logo" sizes="96px" />
              </motion.div>
              <div>
                <h2>
                  <JumpingTextInstagram
                    text={organization.name}
                    className="organization-name-text"
                    mode="character"
                  />
                </h2>
              </div>
            </div>

            <div className="organization-heading-meta">
              <div className="organization-role">
                <span className="organization-label">MY ROLE</span>
                <div className="organization-role-details">
                  <p className="organization-role-text">{organization.role}</p>
                  <span className="organization-period">
                    <span className="organization-period-text">{organization.period}</span>
                  </span>
                </div>
              </div>
              <motion.div
                className="organization-profile-motion"
                initial={{ opacity: 0, scale: 0.78, y: 12 }}
                animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.78, y: 12 }}
                transition={{ type: "spring", stiffness: 190, damping: 18 }}
              >
                <Image
                  src={organization.profile}
                  alt={`${organization.name} profile`}
                  className="organization-profile"
                  sizes="(max-width: 480px) 54px, 76px"
                />
              </motion.div>
            </div>
          </div>

          <div className="organization-story-copy">
            <div className="organization-intro">
              <span className="organization-label">ABOUT THE ORGANIZATION</span>
              <p>
                <JumpingTextInstagram text={organization.introduction} className="organization-copy-text" />
              </p>
            </div>
          </div>

          <div className="organization-responsibilities">
            <span className="organization-label">WHAT I CONTRIBUTED</span>
            <ul>
              {organization.responsibilities.map((responsibility, index) => (
                <li key={responsibility}>
                  <span className="organization-contribution-index">{String(index + 1).padStart(2, "0")}</span>
                  <p>
                    <JumpingTextInstagram text={responsibility} className="organization-copy-text" />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function OrganizationalExperienceSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const titleScale = useTransform(scrollYProgress, [0, 0.12, 0.3], [1, 0.9, 0.5]);
  const titleRotate = useTransform(scrollYProgress, [0, 0.3], [0, -14]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -70]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.24, 0.42], [1, 1, 0]);

  const roboticsScale = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.72, 0.9], [0.72, 0.8, 1, 1, 1.035]);
  const roboticsRotate = useTransform(scrollYProgress, [0, 0.3, 0.72, 0.9], [8, 0, 0, 5]);
  const roboticsY = useTransform(scrollYProgress, [0, 0.3, 0.72, 0.9], [60, 0, 0, -16]);
  const roboticsOpacity = useTransform(scrollYProgress, [0, 0.2, 0.32, 0.88, 0.92], [0, 0, 1, 1, 0]);
  const roboticsBurn = useTransform(scrollYProgress, [0.72, 0.9], ["0%", "150%"]);

  const hmveScale = useTransform(scrollYProgress, [0, 0.68, 0.88, 1], [0.72, 0.72, 1, 1]);
  const hmveRotate = useTransform(scrollYProgress, [0, 0.68, 0.88], [-8, -8, 0]);
  const hmveY = useTransform(scrollYProgress, [0, 0.68, 0.88], [60, 60, 0]);
  const hmveOpacity = useTransform(scrollYProgress, [0, 0.72, 0.88], [0, 0, 1]);
  const noBurn = useTransform(scrollYProgress, () => "0%");

  return (
    <section className="organizational-experience-section" id="organizational-experience">
      <div className="organization-stage-track" ref={heroRef}>
        <div className="organization-stage">
          <motion.div
            className="organization-hero organization-panel organization-title-panel"
            style={{ scale: titleScale, rotate: titleRotate, y: titleY, opacity: titleOpacity, zIndex: 2 }}
          >
            <div className="organization-hero-copy">
              <h1 className="organization-title-reveal-text">ORGANIZATIONAL EXPERIENCE</h1>
            </div>
          </motion.div>

          <OrganizationExperience
            organization={organizations[1]}
            scale={hmveScale}
            rotate={hmveRotate}
            y={hmveY}
            opacity={hmveOpacity}
            burnProgress={noBurn}
            layer={1}
          />
          <OrganizationExperience
            organization={organizations[0]}
            scale={roboticsScale}
            rotate={roboticsRotate}
            y={roboticsY}
            opacity={roboticsOpacity}
            burnProgress={roboticsBurn}
            layer={3}
          />
        </div>
      </div>
    </section>
  );
}
