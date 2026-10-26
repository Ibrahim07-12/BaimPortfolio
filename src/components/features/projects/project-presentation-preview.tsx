"use client";

import { useEffect, useRef, useState } from "react";
import type { PPTXPreviewer as PPTXPreviewerInstance } from "pptx-preview/dist/previewer/PPTXPreviewer";

export default function ProjectPresentationPreview({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let previewer: PPTXPreviewerInstance | null = null;
    const loadPresentation = async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Presentation request failed with status ${response.status}`);
        }
        const data = await response.arrayBuffer();
        if (cancelled) return;

        const { init } = await import("pptx-preview");
        if (cancelled) return;
        const width = Math.max(320, Math.floor(container.clientWidth));
        previewer = init(container, {
          width,
          height: Math.round(width * 9 / 16),
          mode: "list",
        });
        await previewer.preview(data);
        if (!cancelled) setStatus("ready");
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to render project presentation", error);
          setStatus("error");
        }
      }
    };

    void loadPresentation();
    return () => {
      cancelled = true;
      previewer?.destroy();
    };
  }, [src]);

  return (
    <div className="project-presentation-preview" aria-label="Presentation preview">
      {status === "loading" && <p role="status">Loading presentation preview…</p>}
      {status === "error" && <p role="alert">This presentation could not be previewed. Use the download link above to open it.</p>}
      <div ref={containerRef} className="project-presentation-canvas" />
    </div>
  );
}
