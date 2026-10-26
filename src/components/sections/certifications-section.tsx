"use client";

import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import ClothPeelReveal from "@/components/animations/cloth-peel-reveal";
import certificate1 from "@/certifications/CFT1.png";
import certificate2 from "@/certifications/CFT2.png";
import certificate3 from "@/certifications/CFT3.png";
import certificate4 from "@/certifications/CFT4.png";
import certificate5 from "@/certifications/CFT5.jpg";
import certificate6 from "@/certifications/CFT6.jpg";
import certificate7 from "@/certifications/CFT7.jpg";
import certificate8 from "@/certifications/CFT8.jpg";
import certificate9 from "@/certifications/CFT9.jpg";
import certificate10 from "@/certifications/CFT10.jpg";
import "@/styles/sections/certifications-section.css";

type Certificate = {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  credentialUrl: string;
  image: StaticImageData;
  width: number;
  height: number;
};

const certificates: Certificate[] = [
  { title: "Certificate in Supervised Machine Learning: Regression and Classification", issuer: "Coursera", date: "July 2025", credentialId: "U9A42OAOQS4T", credentialUrl: "https://www.coursera.org/account/accomplishments/records/U9A42OAOQS4T", image: certificate1, width: 180, height: 115 },
  { title: "Certificate in Cloud Fundamentals and Gen AI on AWS", issuer: "Dicoding Indonesia", date: "June 2025", credentialId: "JLX19NE5NP72", credentialUrl: "https://www.dicoding.com/certificates/JLX19NE5NP72", image: certificate2, width: 240, height: 145 },
  { title: "Certificate WEB 3.0 & BLOCKCHAIN", issuer: "MySkill", date: "June 2025", credentialId: "MS-23/6/2025-wveAl26tYNupNNoMS1Vi", credentialUrl: "https://drive.google.com/file/d/1sDocmRz6krsYDF12yTRjCoKyrcpjtXW9/view?usp=sharing", image: certificate3, width: 155, height: 115 },
  { title: "Certificate in Linear Models in Machine Learning: Applications", issuer: "Komdigi", date: "June 2025", credentialId: "19510458840-450", credentialUrl: "https://digitalent.komdigi.go.id/cek-sertifikat?registrasi=19510458840-450", image: certificate4, width: 190, height: 130 },
  { title: "Certificate in Fundamentals of Artificial Intelligence Implementation", issuer: "Komdigi", date: "May 2025", credentialId: "2299748850-6205", credentialUrl: "https://digitalent.komdigi.go.id/cek-sertifikat?registrasi=2299748850-6205", image: certificate5, width: 240, height: 145 },
  { title: "Certificate in Linear Models in Machine Learning: Fundamentals", issuer: "Komdigi", date: "May 2025", credentialId: "19510211840-671", credentialUrl: "https://digitalent.komdigi.go.id/cek-sertifikat?registrasi=19510211840-671", image: certificate6, width: 155, height: 115 },
  { title: "Certification in Getting Started with Java Programming", issuer: "Dicoding Indonesia", date: "May 2025", credentialId: "4EXGV0K1QXRL", credentialUrl: "https://www.dicoding.com/certificates/4EXGV0K1QXRL", image: certificate7, width: 220, height: 135 },
  { title: "Certificate Backend in Website Development", issuer: "MySkill", date: "January 2025", credentialId: "219152/WEB/LM/01/2025", credentialUrl: "https://drive.google.com/file/d/1C-qqs5tpuQjiMM8U8KhAaNOtvbgMHgSU/view?usp=drivesdk", image: certificate8, width: 170, height: 115 },
  { title: "Certificate Junior Network Administrator Competency", issuer: "Badan Nasional Sertifikasi Profesi (BNSP)", date: "November 2024", credentialId: "ICT.1272.00041 2024", credentialUrl: "https://drive.google.com/file/d/1LKeS9uEfsTwqINOVKv-6TC3qBdl713Rv/view?usp=sharing", image: certificate9, width: 125, height: 175 },
  { title: "Drone Safety and Ethics Certification Training Course Passed the Practical Test Basic Drone Maneuvers", issuer: "Asosiasi Pilot Drone Indonesia", date: "May 2024", credentialId: "8118-2024", credentialUrl: "https://member.apdi.id/search?number=322404180001", image: certificate10, width: 210, height: 125 },
];

function CertificateDetail({
  selected,
  onSelect,
  onClose,
}: {
  selected: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
  const certificate = certificates[selected];

  return (
    <motion.div
      className="certificate-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      role="dialog"
      aria-modal="true"
      aria-label="Certificate detail"
    >
      <button
        className="certificate-detail-close"
        type="button"
        onMouseDown={onClose}
        onPointerDown={onClose}
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="Back to certifications"
        data-certificate-close
      >
        <X aria-hidden="true" />
      </button>
      <aside className="certificate-thumbnails" aria-label="Certificate list">
        <span className="certificate-index">{String(selected + 1).padStart(2, "0")} / 10</span>
        <div className="certificate-thumbnail-scroll">
          {certificates.map((item, index) => (
            <button
              className={`certificate-thumbnail${selected === index ? " is-selected" : ""}`}
              key={item.title}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Open certificate ${index + 1}`}
            >
              <Image src={item.image} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      </aside>
      <div className="certificate-detail-copy">
        <span className="certificate-detail-label">CERTIFICATE {String(selected + 1).padStart(2, "0")}</span>
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
            <h2>{certificate.title}</h2>
            <dl>
              <div><dt>ISSUER</dt><dd>{certificate.issuer}</dd></div>
              <div><dt>ISSUED</dt><dd>{certificate.date}</dd></div>
              <div><dt>CREDENTIAL ID</dt><dd>{certificate.credentialId}</dd></div>
            </dl>
            <a href={certificate.credentialUrl} target="_blank" rel="noreferrer">
              View credential <ArrowUpRight aria-hidden="true" />
            </a>
        </motion.div>
      </div>
      <div className={`certificate-detail-image certificate-detail-image-${selected + 1}`}>
        <motion.div
          key={selected}
          layoutId={`certificate-image-${selected}`}
          className="certificate-detail-image-inner"
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <Image src={certificate.image} alt={certificate.title} fill sizes="(max-width: 760px) 80vw, 48vw" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function CertificateStackCard({
  certificate,
  index,
  progress,
  spreadReady,
  onSelect,
}: {
  certificate: Certificate;
  index: number;
  progress: MotionValue<number>;
  spreadReady: boolean;
  onSelect: () => void;
}) {
  const spread = [
    { x: -37, y: -29, rotate: -6 },
    { x: -14, y: -33, rotate: 4 },
    { x: 14, y: -33, rotate: -4 },
    { x: 37, y: -27, rotate: 6 },
    { x: -39, y: 0, rotate: 3 },
    { x: 38, y: 1, rotate: -5 },
    { x: -34, y: 29, rotate: -4 },
    { x: -11, y: 33, rotate: 5 },
    { x: 13, y: 32, rotate: -3 },
    { x: 37, y: 27, rotate: 5 },
  ][index];
  const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 900 : window.innerHeight;
  const xOffset = (spread.x / 100) * viewportWidth;
  const yOffset = (spread.y / 100) * viewportHeight;

  return (
    <motion.button
      className={`certificate-stack-card certificate-stack-card-${index + 1}${spreadReady ? " is-interactive" : ""}`}
      type="button"
      disabled={!spreadReady}
      tabIndex={spreadReady ? 0 : -1}
      onClick={onSelect}
      layoutId={`certificate-image-${index}`}
      style={{
        width: certificate.width,
        height: certificate.height,
        left: `calc(50% - ${certificate.width / 2}px)`,
        top: `calc(50% - ${certificate.height / 2}px)`,
        x: useTransform(progress, [0, 1], [0, xOffset]),
        y: useTransform(progress, [0, 1], [0, yOffset]),
        rotate: useTransform(progress, [0, 1], [0, spread.rotate]),
        zIndex: index + 1,
      }}
      aria-label={`Open ${certificate.title}`}
      aria-disabled={!spreadReady}
    >
      <Image src={certificate.image} alt={certificate.title} fill sizes={`${certificate.width}px`} />
    </motion.button>
  );
}

export default function CertificationsSection() {
  const isDark = useSyncExternalStore(
    (onChange) => {
      const observer = new MutationObserver(onChange);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => observer.disconnect();
    },
    () => document.documentElement.dataset.theme === "dark",
    () => false,
  );
  const stackRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [spreadReady, setSpreadReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });
  const clothProgress = useTransform(scrollYProgress, [0, 0.24], [0, 1], { clamp: true });
  const spreadProgress: MotionValue<number> = useTransform(
    scrollYProgress,
    [0.24, 0.72],
    [0, 1],
    { clamp: true },
  );
  const [clothProgressValue, setClothProgressValue] = useState(0);
  const [clothReady, setClothReady] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setSpreadReady(value >= 0.72);
  });
  useMotionValueEvent(clothProgress, "change", (value) => {
    setClothProgressValue(value);
    setClothReady(value >= 0.98);
  });

  useEffect(() => {
    if (selected === null) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return (
    <section
      className="certifications-section"
      id="certifications"
      aria-label="Certifications"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("[data-certificate-close]")) {
          setSelected(null);
        }
      }}
    >
      <div className="certifications-stack-track" ref={stackRef}>
        <div className="certifications-stack-transition">
          <ClothPeelReveal
            className="certifications-cloth"
            sheetColor={isDark ? "#0b1220" : "#f8fafc"}
            textColor={isDark ? "#ffffff" : "#111827"}
            sheetText="CERTIFICATIONS"
            sheetHint="SCROLL TO EXPLORE"
            durationMs={2200}
            delayMs={0}
            scrollProgress={clothProgressValue}
          >
            <div className="certifications-stack-stage">
              <motion.div className="certifications-stack-copy" style={{ opacity: useTransform(spreadProgress, [0.15, 0.45], [0, 1]) }}>
                <h2>Credentials That Build Expertise.</h2>
                <p>A collection of certifications in Machine Learning, AI, cloud computing, software development, and technical engineering.</p>
              </motion.div>
              {certificates.map((certificate, index) => (
                <CertificateStackCard
                  key={certificate.title}
                  certificate={certificate}
                  index={index}
                  progress={spreadProgress}
                  spreadReady={clothReady && spreadReady}
                  onSelect={() => {
                    if (clothReady && spreadReady) setSelected(index);
                  }}
                />
              ))}
            </div>
          </ClothPeelReveal>
        </div>
      </div>
      <AnimatePresence>
        {selected !== null && (
          <CertificateDetail
            key={`certificate-detail-${selected}`}
            selected={selected}
            onSelect={setSelected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
