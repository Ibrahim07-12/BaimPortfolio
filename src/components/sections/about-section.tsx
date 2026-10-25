"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Download } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import ScrollReveal from "@/components/ScrollReveal";
import TechText from "@/components/TechText";
import TextType from "@/components/TextType";
import profilePhoto from "@/foto/Myself.png";
import "./about-section.css";

const aboutCopy =
  "Fresh graduate in Applied Electronics Engineering from Universitas Negeri Yogyakarta with practical experience in industrial automation, robotics, embedded systems, IoT, and Machine Learning. Skilled in sensor integration, microcontroller programming, PCB design, and web-based monitoring systems. Experienced in developing industrial IoT solutions and applying Machine Learning for predictive maintenance and early fault detection.";

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return document.documentElement.dataset.theme === "dark";
}

function getServerThemeSnapshot() {
  return false;
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isVisible) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsVisible(true);
      observer.disconnect();
    }, { threshold: 0.12 });

    observer.observe(section);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section className="about-section" id="about" ref={sectionRef} data-revealed={isVisible}>
      <header className="about-heading">
        <ScrollReveal
          containerClassName="about-title-scroll"
          textClassName="about-title-scroll-content"
          effect="rise"
          splitBy="chars"
          mode="scrub"
          baseOpacity={0.2}
          baseOffset={28}
          enableBlur={false}
          baseRotation={0}
          wordAnimationEnd="bottom 72%"
        >
          <TechText
            className="about-tech-heading"
            text="ABOUT ME"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize={92}
            fontWeight={700}
            letterSpacing={0}
            color={isDark ? "#ffffff" : "#111827"}
            accentColor={isDark ? "#60a5fa" : "#2563eb"}
            align="left"
            reveal="letter"
            labels
            draggable
            selection
            sweep
            intro="assemble"
            introDuration={1.2}
            guides={false}
          />
        </ScrollReveal>
      </header>

      <div className="about-grid">
        <article className="about-copy-card">
          <div className="about-copy-content">
            <TextType
              as="p"
              className="about-copy-text"
              text={aboutCopy}
              typingSpeed={13}
              initialDelay={350}
              loop={false}
              showCursor={false}
              typeEffect="fade"
              startOnVisible
            />
          </div>
          <a className="about-cv-button" href="/cv/cv-ibrahim.pdf" download>
            <Download aria-hidden="true" />
            Download CV
          </a>
        </article>

        <div className="about-profile-shell">
          <ProfileCard
            className="about-profile-card"
            avatarUrl={profilePhoto.src}
            name="Muhammad Ibrahim Musyaffa"
            title="Applied Electronics Engineering"
            handle="ibrahimusyaffa"
            status="Open to work"
            showUserInfo
            contactText="Contact"
            onContactClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            theme={isDark ? "dark" : "light"}
            enableTilt
            tiltStrength={8}
            parallax={10}
            holo={0.28}
            glare={0.3}
            intro
          />
        </div>
      </div>
    </section>
  );
}