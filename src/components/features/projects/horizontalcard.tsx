"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export type HorizontalCardProject = {
  id: number;
  title: string;
  type: "Industry Project" | "Academic Project";
  period: string;
  duration: string;
  summary: string;
  cover: StaticImageData;
};

export function HorizontalCard({
  project,
  index,
  onLearnMore,
}: {
  project: HorizontalCardProject;
  index: number;
  onLearnMore: () => void;
}) {
  return (
    <motion.article
      className="project-card"
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
    >
      <div className="project-card-image">
        <Image
          src={project.cover}
          alt={`${project.title} project`}
          fill
          sizes="(max-width: 700px) 85vw, 40vw"
          className="project-cover-image"
          priority={index === 0}
        />
        <div className="project-card-image-shade" />
        <span className="project-period">{project.period} · {project.duration}</span>
      </div>
      <div className="project-card-copy">
        <div className="project-card-topline">
          <span className={`project-type-pill ${project.type === "Industry Project" ? "is-industry" : "is-academic"}`}>
            {project.type}
          </span>
          <span className="project-index">{String(index + 1).padStart(2, "0")} / 10</span>
        </div>
        <h2>{project.title}</h2>
        <p>{project.summary}</p>
        <button className="project-learn-more" type="button" onClick={onLearnMore}>
          Learn more <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
}
