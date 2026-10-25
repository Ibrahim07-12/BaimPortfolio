import Image, { type ImageProps } from "next/image";
import type { CSSProperties, ReactNode } from "react";

interface DockProps {
  children: ReactNode;
  className?: string;
  iconSize?: number;
  label: string;
}

interface DockIconProps {
  href: string;
  name: string;
  src: ImageProps["src"];
}

export function Dock({ children, className, iconSize = 38, label }: DockProps) {
  return (
    <ul
      aria-label={label}
      className={["dock", className].filter(Boolean).join(" ")}
      style={{ "--dock-icon-size": `${iconSize}px` } as CSSProperties}
    >
      {children}
    </ul>
  );
}

export function DockIcon({ href, name, src }: DockIconProps) {
  return (
    <li className="dock-item">
      <a className="dock-link" href={href} aria-label={name}>
        <Image className="dock-image" src={src} alt="" />
        <span className="dock-tooltip" aria-hidden="true">
          {name}
        </span>
      </a>
    </li>
  );
}
