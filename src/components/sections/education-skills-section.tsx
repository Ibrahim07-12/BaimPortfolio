"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Code2, GraduationCap, School } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";
import autoCAD from "@/ES/AutoCAD.png";
import arduinoIDE from "@/ES/Arduino IDE.png";
import cxProgrammer from "@/ES/CX Programmer.png";
import devCpp from "@/ES/Dev C++.png";
import eagle from "@/ES/EAGLE.png";
import fluidSIM from "@/ES/FluidSIM.png";
import jupyter from "@/ES/Jupyter.png";
import kiCAD from "@/ES/KiCAD.png";
import microsoftOffice from "@/ES/Microsoft Office.png";
import proteus from "@/ES/Proteus.png";
import sketchUp from "@/ES/SketchUp.png";
import vsCode from "@/ES/VSCode.png";
import cpp from "@/PWD/C++.png";
import css from "@/PWD/CSS.png";
import firebase from "@/PWD/Firebase.png";
import html from "@/PWD/HTML.png";
import javaScript from "@/PWD/JavaScript.png";
import mongoDB from "@/PWD/MongoDB.png";
import mySQL from "@/PWD/MySQL.png";
import nextJS from "@/PWD/Next.js.png";
import python from "@/PWD/Python.png";
import tailwindCSS from "@/PWD/TailwindCSS.png";
import "./education-skills-section.css";

const programmingSkills = [
  { name: "C++", src: cpp },
  { name: "Python", src: python },
  { name: "JavaScript", src: javaScript },
  { name: "HTML", src: html },
  { name: "CSS", src: css },
  { name: "Next.js", src: nextJS },
  { name: "TailwindCSS", src: tailwindCSS },
  { name: "MySQL", src: mySQL },
  { name: "Firebase", src: firebase },
  { name: "MongoDB", src: mongoDB },
];

const engineeringSoftware = [
  { name: "Microsoft Office", src: microsoftOffice },
  { name: "Dev C++", src: devCpp },
  { name: "Jupyter", src: jupyter },
  { name: "Proteus", src: proteus },
  { name: "Arduino IDE", src: arduinoIDE },
  { name: "EAGLE", src: eagle },
  { name: "CX Programmer", src: cxProgrammer },
  { name: "SketchUp", src: sketchUp },
  { name: "FluidSIM", src: fluidSIM },
  { name: "KiCAD", src: kiCAD },
  { name: "AutoCAD", src: autoCAD },
  { name: "VSCode", src: vsCode },
];

const textSkillGroups = [
  {
    title: "Embedded systems & automation",
    skills: ["ESP32", "Arduino", "Raspberry Pi", "PLC", "Sensor Integration", "PCB Design", "Robotics", "Industrial Automation"],
  },
  {
    title: "Intelligent systems & IoT",
    skills: ["Machine Learning", "Predictive Maintenance", "IoT Monitoring", "Computer Vision", "Anomaly Detection"],
  },
];

function SkillDock({ items, label }: { items: typeof programmingSkills; label: string }) {
  return (
    <Dock className="skill-dock-list" label={label} iconSize={38}>
      {items.map((item) => (
        <DockIcon key={item.name} src={item.src} name={item.name} href="#skills" />
      ))}
    </Dock>
  );
}

export default function EducationSkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 42%"],
  });
  const skillsOpacity = useTransform(scrollYProgress, [0, 0.52], [0, 1]);
  const skillsY = useTransform(scrollYProgress, [0, 0.52], [52, 0]);
  const educationOpacity = useTransform(scrollYProgress, [0.08, 0.64], [0, 1]);
  const educationY = useTransform(scrollYProgress, [0.08, 0.64], [58, 0]);

  return (
    <section className="education-skills-section" id="education" ref={sectionRef}>
      <motion.article
        className="education-skills-card skills-card"
        id="skills"
        style={{ opacity: reduceMotion ? 1 : skillsOpacity, y: reduceMotion ? 0 : skillsY }}
      >
        <header className="skills-card-heading">
          <span className="skills-heading-icon"><Code2 aria-hidden="true" /></span>
          <h2>TECHNICAL SKILLS</h2>
        </header>
        <div className="skills-card-content">
          <section className="skill-group" aria-labelledby="programming-skills-heading">
            <h3 id="programming-skills-heading">Programming & web development</h3>
            <SkillDock items={programmingSkills} label="Programming and web development technologies" />
          </section>
          {textSkillGroups.map((group) => (
            <section className="skill-group" key={group.title}>
              <h3>{group.title}</h3>
              <ul className="skill-tag-list">
                {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </section>
          ))}
          <section className="skill-group" aria-labelledby="engineering-software-heading">
            <h3 id="engineering-software-heading">Engineering software</h3>
            <SkillDock items={engineeringSoftware} label="Engineering software tools" />
          </section>
        </div>
      </motion.article>

      <motion.article
        className="education-skills-card education-card"
        style={{ opacity: reduceMotion ? 1 : educationOpacity, y: reduceMotion ? 0 : educationY }}
      >
        <div className="education-topline">
          <span className="education-icon"><GraduationCap aria-hidden="true" /></span>
          <span className="graduation-pill">GRADUATED 2026</span>
        </div>
        <div className="education-details">
          <p className="university-name"><School aria-hidden="true" /> Universitas Negeri Yogyakarta</p>
          <h2>Applied Electronics Engineering</h2>
          <p className="degree-name">Applied Bachelor&apos;s Degree (D4)</p>
          <div className="coursework">
            <h3>Relevant coursework</h3>
            <ul className="coursework-list">
              {[
                "Microcontroller",
                "Control Systems",
                "PLC",
                "Mechatronics",
                "Artificial Intelligence",
                "Internet of Things",
                "Robotics",
                "Digital Image Processing",
                "Intelligent Control Systems",
              ].map((course) => <li key={course}>{course}</li>)}
            </ul>
          </div>
          <div className="gpa-block">
            <strong>3.75</strong>
            <span><b>GPA</b><br />/ 4.00</span>
          </div>
        </div>
      </motion.article>
    </section>
  );
}
