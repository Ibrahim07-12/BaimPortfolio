"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";
import "./loading-screen.css";

const loadingAsset = "/loading-screen/loading.lottie";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const finishWhenReady = () => {
      void document.fonts.ready.then(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.setTimeout(() => {
              if (!cancelled) setVisible(false);
            }, 350);
          });
        });
      });
    };

    if (document.readyState === "complete") {
      finishWhenReady();
    } else {
      window.addEventListener("load", finishWhenReady, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", finishWhenReady);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="loading-screen" role="status" aria-label="Loading portfolio">
      <DotLottieReact
        autoplay
        loop
        src={loadingAsset}
        className="loading-screen-animation"
      />
      <span className="loading-screen-label">Loading portfolio</span>
    </div>
  );
}
