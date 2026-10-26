"use client";

import Image, { type StaticImageData } from "next/image";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  Clock3,
  Download,
  ExternalLink,
  Play,
  Users,
  X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import GlyphPortal from "@/components/features/projects/glyph-portal";
import { HorizontalCard } from "@/components/features/projects/horizontalcard";
import ProjectPresentationPreview from "@/components/features/projects/project-presentation-preview";
import project1Cover from "@/Projects/project1/project1P.jpeg";
import project1Drive from "@/Projects/project1/GD.png";
import project2Cover from "@/Projects/project2/project2P.jpeg";
import project2Photo1 from "@/Projects/project2/F1(2).jpeg";
import project2Photo2 from "@/Projects/project2/F2(2).jpeg";
import project3Cover from "@/Projects/project3/project3P.jpeg";
import project4Cover from "@/Projects/project4/project4P.jpeg";
import project4Photo1 from "@/Projects/project4/F1(4).png";
import project4Photo2 from "@/Projects/project4/F2(4).png";
import project4Photo3 from "@/Projects/project4/F3(4).png";
import project5Cover from "@/Projects/project5/project5P.jpg";
import project5Photo1 from "@/Projects/project5/F1(5).jpg";
import project5Photo2 from "@/Projects/project5/F2(5).jpg";
import project5Photo3 from "@/Projects/project5/F3(5).jpeg";
import project5Photo4 from "@/Projects/project5/F4(5).jpeg";
import project6Cover from "@/Projects/project6/project6P.png";
import project7Cover from "@/Projects/project7/project7P.jpg";
import project7Photo1 from "@/Projects/project7/F1(7).jpg";
import project8Cover from "@/Projects/project8/project8P.jpeg";
import project8Photo1 from "@/Projects/project8/F1(8).jpeg";
import project8Photo2 from "@/Projects/project8/F2(8).jpeg";
import project9Cover from "@/Projects/project9/project9P.jpeg";
import project9Photo1 from "@/Projects/project9/F1(9).png";
import project9Photo2 from "@/Projects/project9/F2(9).png";
import project10Cover from "@/Projects/project10/picture10P.jpeg";
import project10Photo1 from "@/Projects/project10/F1(10).jpg";
import project10Photo2 from "@/Projects/project10/F2(10).jpeg";
import "@/styles/sections/projects-section.css";

type Project = {
  id: number;
  title: string;
  type: "Industry Project" | "Academic Project";
  period: string;
  duration: string;
  team: string;
  summary: string;
  overview: string[];
  responsibilities: string[];
  tools: string[];
  cover: StaticImageData;
  photos: StaticImageData[];
  video?: string;
  pdf?: string;
  presentation?: string;
  drive?: string;
  sourceCode?: string;
};

const mediaUrl = (project: number, file: string) =>
  `/api/project-media?project=${project}&file=${encodeURIComponent(file)}`;

const projects: Project[] = [
  {
    id: 1,
    title: "Machine Learning Based Predictive Maintenance System for Early Fault Detection of Mainshakeout Motor",
    type: "Industry Project",
    period: "OCT 2025 — JAN 2026",
    duration: "4 months",
    team: "1 contributor",
    summary:
      "Built an IoT predictive-maintenance system that combines machine-condition sensors, anomaly detection, a web dashboard, and automated alerts.",
    overview: [
      "This project developed an IoT-based system to monitor the Mainshakeout motor at a foundry plant using vibration, temperature, sound, and three-phase electrical power measurements.",
      "A Hybrid LSTM-Autoencoder was trained on 12,456 data points from normal operating conditions to learn the machine's baseline and help identify abnormal behavior.",
      "ESP32 sensor acquisition feeds a Raspberry Pi 4 gateway and a web-based dashboard. Telegram and Gmail notifications help communicate potential abnormalities to the maintenance team.",
    ],
    responsibilities: [
      "Designed and integrated sensor systems for vibration, temperature, sound, and three-phase power monitoring.",
      "Installed and tested sensors, ESP32 hardware, and electrical measurement components on the target machine.",
      "Collected and processed 12,456 normal-operation data points for model training.",
      "Implemented the Hybrid LSTM-Autoencoder anomaly-detection approach.",
      "Developed the monitoring dashboard and automated Telegram and Gmail notifications.",
      "Tested, commissioned, and demonstrated the system with the Foundry Maintenance team.",
    ],
    tools: [
      "Python",
      "Hybrid LSTM-Autoencoder",
      "ESP32",
      "Raspberry Pi 4",
      "IoT Sensors",
      "Web Dashboard",
      "Telegram",
      "Gmail",
    ],
    cover: project1Cover,
    photos: [],
    presentation: "PT1.pptx",
    drive: "GD.png",
  },
  {
    id: 2,
    title: "Thermoelectric Generator (TEG) Based Power Generation Prototype",
    type: "Industry Project",
    period: "SEP — NOV 2025",
    duration: "3 months",
    team: "1 contributor",
    summary:
      "Assembled a thermoelectric prototype to turn foundry waste heat into electrical energy and evaluated its output under operating conditions.",
    overview: [
      "The prototype investigates recovering waste heat from a foundry plant and converting it into usable electrical energy with thermoelectric generator modules.",
      "TEG modules were arranged in series and parallel. Hot foundry air warmed one side while cooling-tower water cooled the other to create a temperature gradient.",
      "A conditioning circuit with diodes, a capacitor bank, and a DC-DC converter supported the generated output. Testing and calculations evaluated voltage, current, power, and circuit losses.",
    ],
    responsibilities: [
      "Assembled and wired the TEG modules and supporting electrical circuit.",
      "Calculated expected output from temperature differences and module performance.",
      "Compared series-parallel configurations and calculated voltage, current, power, and losses.",
      "Tested the prototype under operating conditions.",
      "Demonstrated the prototype to the Foundry Maintenance Team.",
    ],
    tools: [
      "Thermoelectric Generator",
      "Electrical Circuit Design",
      "Series-Parallel Configuration",
      "DC-DC Converter",
      "Electrical Measurement",
      "Prototype Testing",
    ],
    cover: project2Cover,
    photos: [project2Photo1, project2Photo2],
    video: "V2.mp4",
  },
  {
    id: 4,
    title: "Spare Part Order Status Monitoring System",
    type: "Industry Project",
    period: "AUG — SEP 2025",
    duration: "2 months",
    team: "1 contributor",
    summary:
      "Created a web platform for foundry teams to track spare-part orders, update delivery status, and search historical requests.",
    overview: [
      "This responsive web application addresses the difficulty technicians and operators faced when checking whether ordered spare parts had arrived, reducing repeated manual confirmations.",
      "Records include spare-part names and specifications, machines, quantities, requesters, order dates, vendors, and delivery statuses. Separate interfaces support operators and technicians as well as authorized spare-part personnel.",
      "Firebase Authentication manages access, while Cloud Firestore stores order data. A search feature helps retrieve previously ordered items.",
    ],
    responsibilities: [
      "Designed and developed the website, including the user interface, system structure, and core functionality.",
      "Defined the order-tracking workflow with input from the Head of Spare Part Management.",
      "Built separate interfaces for operators/technicians and spare-part personnel.",
      "Implemented order monitoring, data management, status updates, editing, and order history.",
      "Integrated Firebase Authentication and Cloud Firestore.",
      "Demonstrated the website to spare-part personnel and the Foundry Maintenance Team Leader.",
    ],
    tools: [
      "Next.js",
      "Tailwind CSS",
      "JavaScript",
      "Firebase Authentication",
      "Cloud Firestore",
      "Responsive Web Design",
    ],
    cover: project4Cover,
    photos: [project4Photo1, project4Photo2, project4Photo3],
  },
  {
    id: 3,
    title: "IoT Based Smart Lighting Control System",
    type: "Industry Project",
    period: "JUL — SEP 2025",
    duration: "3 months",
    team: "1 contributor",
    summary:
      "Designed and installed a remote lighting-control system for a foundry, taking it from component integration through commissioning and demonstration.",
    overview: [
      "The Smart Lighting Control System improves lighting management and operational convenience in a foundry plant through remote control and monitoring.",
      "Work covered system design, component assembly, on-site implementation, functional testing, and commissioning to verify remote operation before the final demonstration to the Maintenance Team.",
    ],
    responsibilities: [
      "Designed the system around operating requirements from the Foundry Maintenance Team.",
      "Assembled and integrated electronic, electrical, and control components.",
      "Installed and implemented the system on-site in the foundry plant.",
      "Performed functional testing and commissioning of remote-control operation.",
      "Demonstrated the completed system and explained its features to the Maintenance Team.",
    ],
    tools: [
      "Internet of Things",
      "Embedded Systems",
      "Electronics Integration",
      "Lighting Control",
      "Remote Monitoring",
      "System Testing",
      "Commissioning",
    ],
    cover: project3Cover,
    photos: [],
    video: "V3.mp4",
    presentation: "PT3.pptx",
  },
  {
    id: 5,
    title: "Line Follower Robot Project",
    type: "Academic Project",
    period: "AUG — NOV 2024",
    duration: "4 months",
    team: "4 team members",
    summary:
      "Developed a modular line following robot with an Arduino Nano, eight photodiode sensors, a custom control PCB, and FSM-based navigation.",
    overview: [
      "The robot uses a modular head and two body sections, an Arduino Nano as its controller, eight photodiode sensors for line detection, and DC motors for movement.",
      "A CD4051BE multiplexer conserves I/O pins. An OLED provides Start, sensor Setting, and Pause modes. The electronics include a two-cell LiPo battery, MT-3608 boost converter, and L293D motor driver.",
      "A finite state machine coordinates movement and obstacle handling. The robot completed its final test track.",
    ],
    responsibilities: [
      "Designed the electronic schematic and PCB routing in EAGLE.",
      "Fabricated the PCB through etching, cutting, and drilling.",
      "Installed components and performed continuity and component checks.",
      "Programmed sensor readings, motor control, and supporting electronic functions.",
      "Contributed to autonomous line-following behavior.",
    ],
    tools: [
      "Arduino Nano",
      "C/C++",
      "EAGLE",
      "PCB Design",
      "Photodiode Sensors",
      "CD4051BE",
      "L293D",
      "OLED",
      "FSM",
    ],
    cover: project5Cover,
    photos: [project5Photo1, project5Photo2, project5Photo3, project5Photo4],
    video: "V5.mp4",
  },
  {
    id: 6,
    title: "YOLO Based Smart Traffic Light System Prototype",
    type: "Academic Project",
    period: "OCT — NOV 2024",
    duration: "2 months",
    team: "3 team members",
    summary:
      "Explored adaptive traffic signals using YOLO vehicle detection and MQTT messaging to respond to changing traffic density.",
    overview: [
      "The prototype concept addresses fixed-duration traffic signals that cannot adapt well to changing traffic conditions.",
      "Cameras and YOLO-based detection estimate intersection saturation. A microcomputer calculates adaptive signal durations and communicates them to a microcontroller through MQTT.",
      "The proposed system aims to respond more quickly to traffic density, reduce queues, and support smoother movement at busy intersections.",
    ],
    responsibilities: [
      "Contributed to technical discussions and system design for YOLO-based vehicle detection.",
      "Assisted with prototype development, design, and implementation.",
      "Researched and assessed potential testing locations using online platforms.",
    ],
    tools: [
      "YOLO",
      "Computer Vision",
      "Vehicle Detection",
      "MQTT",
      "Microcomputer",
      "Microcontroller",
      "Adaptive Signal Control",
    ],
    cover: project6Cover,
    photos: [],
    presentation: "PT6.pptx",
    pdf: "PF6.pdf",
  },
  {
    id: 7,
    title: "YuNet and Face Recognition Based Face Detection and Recognition System",
    type: "Academic Project",
    period: "OCT — NOV 2024",
    duration: "2 months",
    team: "3 team members",
    summary:
      "Built a real-time face detection and recognition prototype using YuNet and face_recognition for webcam or image-based matching.",
    overview: [
      "The system combines YuNet face detection with the face_recognition library to identify known individuals from webcam streams or static images.",
      "During dataset preparation, 15 facial images were collected from each team member and stored in a known_faces.pkl file for later recognition.",
      "The project explored possible uses in attendance, security, and identity-management systems.",
    ],
    responsibilities: [
      "Collected 15 facial images from each team member and prepared the recognition dataset.",
      "Participated in defining the project concept and system architecture.",
      "Assisted with development and integration of YuNet and face_recognition.",
    ],
    tools: [
      "Python",
      "YuNet",
      "face_recognition",
      "Computer Vision",
      "CNN Face Detection",
      "ResNet Face Recognition",
      "Webcam Processing",
      "Pickle",
    ],
    cover: project7Cover,
    photos: [project7Photo1],
    pdf: "PF7.pdf",
    sourceCode:
      "https://drive.google.com/file/d/1YCyePo9vkPNYCjReYk3Z6Hw2RFA9GCeU/view?usp=sharing",
  },
  {
    id: 8,
    title: "Microcontroller Based Home Automation System",
    type: "Academic Project",
    period: "MAY — JUN 2024",
    duration: "2 months",
    team: "4 team members",
    summary:
      "Created an ESP32 home-automation prototype that senses temperature, humidity, motion, and ambient light to control household devices.",
    overview: [
      "The prototype monitors indoor conditions and automates selected household devices. A DHT22 measures temperature and humidity, PIR detects movement, and an LDR reads ambient light.",
      "The ESP32 processes sensor inputs and controls a fan, bathroom light, and terrace light through relay modules.",
      "Coordinated sensor readings and device responses demonstrate how embedded systems can support comfort, convenience, and energy efficiency.",
    ],
    responsibilities: [
      "Designed and assembled wiring for the electronic components.",
      "Developed and assembled the sensor-based automation prototype.",
      "Programmed integration of the DHT22, LDR, and PIR sensors.",
      "Implemented temperature, humidity, lighting, and motion response logic.",
    ],
    tools: [
      "ESP32",
      "Arduino IDE",
      "C/C++",
      "DHT22",
      "PIR Sensor",
      "LDR Sensor",
      "Relay Modules",
      "Embedded Systems",
    ],
    cover: project8Cover,
    photos: [project8Photo1, project8Photo2],
    pdf: "PF8.pdf",
  },
  {
    id: 9,
    title: "PLC-Based Water Tank Filling System Simulation",
    type: "Academic Project",
    period: "JUN 2024",
    duration: "1 month",
    team: "1 contributor",
    summary:
      "Simulated a chemical mixing and tank-filling process with PLC ladder logic, timed operations, parallel heating, and an HMI-style interface.",
    overview: [
      "This individual PLC practicum mini-project simulates an automated process for mixing, heating, and transferring materials across three subsystems.",
      "The first subsystem mixes chemicals A and B for 10 seconds while a second subsystem heats chemical C for 15 seconds; both run in parallel. The third subsystem adds chemical D, mixes for 10 seconds, then discharges until its empty sensor is triggered.",
      "The simulation provided hands-on experience in PLC programming, timers, sequence control, and process visualization.",
    ],
    responsibilities: [
      "Designed the full ladder-logic program in CX-Programmer.",
      "Created tank and process visualization in CX-Designer.",
      "Implemented timer-based mixing and heating sequences.",
      "Configured parallel operation for the first two subsystems.",
      "Developed transfer and discharge logic with an empty-tank sensor.",
      "Demonstrated the complete simulation from control logic to visual interface.",
    ],
    tools: [
      "PLC",
      "CX-Programmer",
      "CX-Designer",
      "Ladder Logic",
      "Timer-Based Control",
      "Industrial Process Simulation",
      "HMI Visualization",
    ],
    cover: project9Cover,
    photos: [project9Photo1, project9Photo2],
  },
  {
    id: 10,
    title: "Fuzzy Logic Based Automatic Door System",
    type: "Academic Project",
    period: "MAY 2024",
    duration: "1 month",
    team: "4 team members",
    summary:
      "Designed an automatic-door prototype using ultrasonic distance sensing, MQ-2 gas detection, and fuzzy logic for normal and fire-safety responses.",
    overview: [
      "The prototype combines an ultrasonic sensor to detect approaching people with an MQ-2 gas sensor to monitor potentially hazardous smoke.",
      "In normal operation, distance rules keep the door closed from 30 cm, begin opening at 20 cm, and open fully at 10 cm. When gas reaches a hazardous threshold, the system commands the door fully open as an evacuation route.",
      "Fuzzy logic coordinates sensor inputs and door responses for the prototype.",
    ],
    responsibilities: [
      "Designed and assembled the electronic component wiring.",
      "Developed and assembled the automatic-door prototype.",
      "Integrated ultrasonic and MQ-2 gas sensors.",
      "Programmed fuzzy-logic control for distance and gas measurements.",
    ],
    tools: [
      "Fuzzy Logic",
      "Ultrasonic Sensor",
      "MQ-2 Gas Sensor",
      "Embedded Systems",
      "Sensor Integration",
      "Automatic Door Control",
      "Fire Safety Prototype",
    ],
    cover: project10Cover,
    photos: [project10Photo1, project10Photo2],
    pdf: "PF10.pdf",
  },
];

function ProjectDetails({
  project,
  onClose,
  onViewPhoto,
  onViewVideo,
}: {
  project: Project;
  onClose: () => void;
  onViewPhoto: (photo: StaticImageData, alt: string) => void;
  onViewVideo: (url: string) => void;
}) {
  return (
    <motion.article
      className="project-expanded-card"
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-title-${project.id}`}
    >
      <button className="project-close-button" type="button" onClick={onClose} aria-label="Close project details">
        <X aria-hidden="true" />
      </button>
      <header className="project-expanded-header">
        <Image
          src={project.cover}
          alt=""
          fill
          sizes="100vw"
          className="project-expanded-cover"
        />
        <div className="project-expanded-header-overlay" />
        <div className="project-expanded-heading">
          <span className={`project-type-pill ${project.type === "Industry Project" ? "is-industry" : "is-academic"}`}>
            {project.type} · {project.period}
          </span>
          <h2 id={`project-title-${project.id}`}>{project.title}</h2>
          <div className="project-facts">
            <span><Clock3 aria-hidden="true" /> {project.duration}</span>
            <span><Users aria-hidden="true" /> {project.team}</span>
          </div>
        </div>
      </header>

      <div className="project-expanded-grid">
        <div className="project-media-column">
          <section className="project-detail-block">
            <span className="project-detail-label">Project overview</span>
            {project.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>

          {project.photos.length > 0 && (
            <section className="project-detail-block">
              <span className="project-detail-label">Project gallery <span>Double-click to enlarge</span></span>
              <div className="project-gallery">
                {project.photos.map((photo, index) => (
                  <button
                    type="button"
                    key={photo.src}
                    className="project-gallery-photo"
                    onDoubleClick={() => onViewPhoto(photo, `${project.title} photo ${index + 1}`)}
                    aria-label={`Double-click to view photo ${index + 1} full size`}
                  >
                    <Image src={photo} alt={`${project.title} documentation ${index + 1}`} fill sizes="(max-width: 700px) 90vw, 30vw" />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {project.video && (
            <section className="project-detail-block">
              <span className="project-detail-label">Video showcase <span>Double-click to open player</span></span>
              <button
                type="button"
                className="project-video-preview"
                onDoubleClick={() => onViewVideo(mediaUrl(project.id, project.video!))}
                aria-label="Double-click to open video showcase"
              >
                <Image src={project.cover} alt="" fill sizes="(max-width: 700px) 90vw, 60vw" />
                <span><Play aria-hidden="true" /> Double-click to play</span>
              </button>
            </section>
          )}

          {(project.pdf || project.presentation || project.drive) && (
            <section className="project-detail-block project-documents">
              <span className="project-detail-label">Project documents</span>
              <div className="project-document-links">
                {project.pdf && (
                  <a href={mediaUrl(project.id, project.pdf)} target="_blank" rel="noreferrer">
                    <ExternalLink aria-hidden="true" /> Open PDF
                  </a>
                )}
                {project.presentation && (
                  <a href={mediaUrl(project.id, project.presentation)} download>
                    <Download aria-hidden="true" /> Download PPTX
                  </a>
                )}
                {project.drive && (
                  <a href="https://drive.google.com/drive/folders/1UTSb18pfYy-yoRlsi0_cP89pJ8Jof3ck?usp=drive_link" target="_blank" rel="noreferrer">
                    <Image src={project1Drive} alt="" width={22} height={22} /> Open prototype in Drive
                  </a>
                )}
                {project.sourceCode && (
                  <a href={project.sourceCode} target="_blank" rel="noreferrer">
                    <ExternalLink aria-hidden="true" /> View program files
                  </a>
                )}
              </div>
              {project.pdf && (
                <iframe
                  className="project-pdf-embed"
                  src={mediaUrl(project.id, project.pdf)}
                  title={`${project.title} PDF`}
                />
              )}
              {project.presentation && (
                <ProjectPresentationPreview
                  src={mediaUrl(project.id, project.presentation)}
                />
              )}
            </section>
          )}
        </div>

        <aside className="project-details-column">
          <section className="project-detail-block">
            <span className="project-detail-label">My responsibilities</span>
            <ul className="project-responsibilities">
              {project.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}
            </ul>
          </section>
          <section className="project-detail-block">
            <span className="project-detail-label">Tools &amp; tech stack</span>
            <div className="project-tech-list">
              {project.tools.map((tool) => <span key={tool}>{tool}</span>)}
            </div>
          </section>
        </aside>
      </div>
    </motion.article>
  );
}

function ProjectMediaViewer({
  photo,
  video,
  onClose,
}: {
  photo: { image: StaticImageData; alt: string } | null;
  video: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!photo && !video) return;
    const originalOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [photo, video, onClose]);

  if (!photo && !video) return null;

  return (
    <motion.div
      className="project-viewer-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button className="project-viewer-close" type="button" onClick={onClose} aria-label="Close media viewer">
        <X aria-hidden="true" />
      </button>
      {photo ? (
        <Image
          src={photo.image}
          alt={photo.alt}
          width={photo.image.width}
          height={photo.image.height}
          className="project-viewer-image"
          sizes="100vw"
          priority
        />
      ) : (
        <video className="project-viewer-video" src={video ?? undefined} controls autoPlay />
      )}
    </motion.div>
  );
}

function ProjectCircleWipe({
  mode,
  compact,
  color,
  onCoverComplete,
  onComplete,
}: {
  mode: "opening" | "closing";
  compact: boolean;
  color: string;
  onCoverComplete: () => void;
  onComplete: () => void;
}) {
  const controls = useAnimationControls();
  const viewport = useRef({ width: 1, height: 1 });
  useLayoutEffect(() => {
    const updateViewport = () => {
      viewport.current = { width: window.innerWidth, height: window.innerHeight };
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const bottomLeftInset = compact ? 25 : 33;
  const topRightInset = compact ? 32 : 43;
  const bottomLeft = compact
    ? "25px calc(100% - 25px)"
    : "33px calc(100% - 33px)";
  const topRight = compact
    ? "calc(100% - 32px) 32px"
    : "calc(100% - 43px) 43px";
  const startRadius = mode === "opening"
    ? compact ? 15 : 17
    : compact ? 20 : 23;
  const endRadius = mode === "opening"
    ? compact ? 20 : 23
    : compact ? 15 : 17;
  const startOrigin = mode === "opening" ? bottomLeft : topRight;
  const endOrigin = mode === "opening" ? topRight : bottomLeft;
  const callbacks = useRef({ onCoverComplete, onComplete });

  useEffect(() => {
    callbacks.current = { onCoverComplete, onComplete };
  }, [onComplete, onCoverComplete]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const { width, height } = viewport.current;
      const fullViewportRadius = `${Math.hypot(width, height) + 8}px`;
      const startX = mode === "opening" ? bottomLeftInset : width - topRightInset;
      const startY = mode === "opening" ? height - bottomLeftInset : topRightInset;
      const endX = mode === "opening" ? width - topRightInset : bottomLeftInset;
      const endY = mode === "opening" ? topRightInset : height - bottomLeftInset;
      controls.set({ clipPath: `circle(${startRadius}px at ${startX}px ${startY}px)` });
      await controls.start({
        clipPath: `circle(${fullViewportRadius} at ${startX}px ${startY}px)`,
        transition: { duration: 2.2, ease: [0.76, 0, 0.24, 1] },
      });
      if (cancelled) return;
      callbacks.current.onCoverComplete();
      controls.set({ clipPath: `circle(${fullViewportRadius} at ${endX}px ${endY}px)` });
      await controls.start({
        clipPath: `circle(${endRadius}px at ${endX}px ${endY}px)`,
        transition: { duration: 2.2, ease: [0.76, 0, 0.24, 1] },
      });
      if (!cancelled) callbacks.current.onComplete();
    };

    void run();
    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [
    bottomLeftInset,
    controls,
    endOrigin,
    endRadius,
    mode,
    startOrigin,
    startRadius,
    topRightInset,
  ]);

  return (
    <motion.div
      className="project-circle-wipe"
      initial={false}
      animate={controls}
      style={{
        backgroundColor: color,
        clipPath: `circle(${startRadius}px at ${startOrigin})`,
      }}
      aria-hidden="true"
    />
  );
}

function ProjectsRail() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const railX = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(projects.length - 1) * 100}vw`]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [viewedPhoto, setViewedPhoto] = useState<{ image: StaticImageData; alt: string } | null>(null);
  const [viewedVideo, setViewedVideo] = useState<string | null>(null);
  const mediaViewerOpen = useRef(false);
  const [compactViewport, setCompactViewport] = useState(false);
  const [transitionMode, setTransitionMode] = useState<"opening" | "closing" | null>(null);
  const [contentRevealed, setContentRevealed] = useState(false);
  const [wipeColor, setWipeColor] = useState("#000000");

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const updateViewport = () => setCompactViewport(query.matches);
    updateViewport();
    query.addEventListener("change", updateViewport);
    return () => query.removeEventListener("change", updateViewport);
  }, []);

  function openProject(project: Project) {
    setWipeColor(document.documentElement.dataset.theme === "dark" ? "#ffffff" : "#000000");
    setContentRevealed(false);
    setActiveProject(project);
    setTransitionMode("opening");
  }

  function beginCloseProject() {
    if (transitionMode || !activeProject) return;
    setTransitionMode("closing");
  }

  function finishWipe() {
    if (transitionMode === "opening") {
      setTransitionMode(null);
    } else if (transitionMode === "closing") {
      setActiveProject(null);
      setTransitionMode(null);
    }
  }

  useLayoutEffect(() => {
    mediaViewerOpen.current = Boolean(viewedPhoto || viewedVideo);
  }, [viewedPhoto, viewedVideo]);

  useEffect(() => {
    if (!activeProject) return;
    const previousOverflow = document.body.style.overflow;
    document.body.classList.add("project-details-open");
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !mediaViewerOpen.current && !transitionMode) {
        setTransitionMode("closing");
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("project-details-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeProject, transitionMode]);

  return (
    <div className="projects-scroll-track" ref={trackRef} style={{ "--project-count": projects.length } as CSSProperties}>
      <div className="projects-sticky-stage">
        <div className="projects-stage-heading">
          <span>Selected work</span>
          <span>Scroll to explore <ArrowDownRight aria-hidden="true" /></span>
        </div>
        <motion.div className="projects-horizontal-rail" style={{ x: railX }}>
          {projects.map((project, index) => (
            <div className="projects-slide" key={project.id}>
              <span className="projects-slide-counter">{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
              <HorizontalCard
                project={project}
                index={index}
                onLearnMore={() => openProject(project)}
              />
              <span className="projects-slide-next">{index < projects.length - 1 ? <ArrowRight aria-hidden="true" /> : "END"}</span>
            </div>
          ))}
        </motion.div>
        <div className="projects-scroll-progress" aria-hidden="true">
          <motion.span style={{ scaleX: scrollYProgress, transformOrigin: "left" }} />
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="project-expanded-backdrop"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) beginCloseProject();
            }}
          >
            <motion.div
              className={`project-expanded-content${transitionMode ? " is-transitioning" : ""}`}
              initial={false}
              animate={{ opacity: contentRevealed ? 1 : 0 }}
              transition={{ duration: 0.12 }}
            >
              <ProjectDetails
                project={activeProject}
                onClose={beginCloseProject}
                onViewPhoto={(image, alt) => setViewedPhoto({ image, alt })}
                onViewVideo={setViewedVideo}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {transitionMode && (
          <ProjectCircleWipe
            key={transitionMode}
            mode={transitionMode}
            compact={compactViewport}
            color={wipeColor}
            onCoverComplete={() => {
              if (transitionMode === "opening") setContentRevealed(true);
              if (transitionMode === "closing") setActiveProject(null);
            }}
            onComplete={finishWipe}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(viewedPhoto || viewedVideo) && (
          <ProjectMediaViewer
            photo={viewedPhoto}
            video={viewedVideo}
            onClose={() => {
              setViewedPhoto(null);
              setViewedVideo(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <>
      <div id="projects">
        <GlyphPortal
          word="PROJECTS"
          focusChar="P"
          interactive={false}
          enterLabel="Explore projects"
          scrollLength={2}
          className="projects-glyph-portal"
          fontFamily="var(--font-geist-sans), Arial, sans-serif"
          background={<div className="projects-glyph-field" aria-hidden="true" />}
          style={{
            "--gp-paper": "var(--background)",
            "--gp-ink": "var(--foreground)",
            "--gp-field": "var(--foreground)",
            "--gp-foreground": "var(--foreground)",
          }}
        >
          <ProjectsRail />
        </GlyphPortal>
      </div>
      <div className="portfolio-signature" aria-label="Ibrahim Portfolio">
        <span className="portfolio-signature-mark">I</span>
        <span className="portfolio-signature-label">IBRAHIM <i>/</i> PORTFOLIO</span>
      </div>
    </>
  );
}
