"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValueEvent, useScroll, type Variants } from "framer-motion";
import { ArrowUpRight, Menu, MessageCircle, Moon, Navigation, Sun } from "lucide-react";
import GooeyNav from "@/components/animations/GooeyNav";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "ABOUT", href: "#about" },
  { name: "WORK", href: "#work-experience" },
  { name: "ORGANIZATIONAL", href: "#organizational-experience" },
  { name: "PROJECTS", href: "#projects" },
  { name: "ACHIEVEMENTS", href: "#achievements" },
  { name: "CERTIFICATIONS", href: "#certifications" },
];

const containerVariants: Variants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "min(1600px, calc(100vw - 40px))",
    transition: {
      y: { type: "spring", damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "min(11rem, calc(100vw - 24px))",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  hidden: {
    y: -110,
    opacity: 0,
    width: "min(11rem, calc(100vw - 24px))",
    transition: { duration: 0.24, ease: "easeIn" },
  },
};

const logoVariants: Variants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: 0.3 } },
};

const itemVariants: Variants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const collapsedIconVariants: Variants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: { opacity: 1, scale: 1, transition: { type: "spring", damping: 15, stiffness: 300, delay: 0.15 } },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const [gooeyReady, setGooeyReady] = React.useState(true);
  const [showActiveGooeyPill, setShowActiveGooeyPill] = React.useState(true);
  const [gooeyLayoutVersion, setGooeyLayoutVersion] = React.useState(0);
  const [activeNavIndex, setActiveNavIndex] = React.useState(0);
  const [isContactActive, setIsContactActive] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [navVisible, setNavVisible] = React.useState(true);
  const [theme, setTheme] = React.useState<"light" | "dark">(() => (
    typeof window !== "undefined" && window.localStorage.getItem("portfolio-theme") === "dark" ? "dark" : "light"
  ));
  const [transitionTheme, setTransitionTheme] = React.useState<"light" | "dark" | null>(null);
  const [transitionPhase, setTransitionPhase] = React.useState<"expand" | "contract">("expand");
  const [themeOrigin, setThemeOrigin] = React.useState({ x: 0, y: 0 });
  const themeButtonRef = React.useRef<HTMLButtonElement>(null);
  const themeTransitionTimer = React.useRef<number | null>(null);
  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const anchorNavigationTarget = React.useRef<string | null>(null);
  const anchorNavigationTimer = React.useRef<number | null>(null);
  const navVisibilityTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.35;
      const contact = document.querySelector<HTMLElement>("#contact");
      setIsContactActive(Boolean(contact && contact.getBoundingClientRect().top <= marker));
      const currentIndex = navItems.reduce((activeIndex, item, index) => {
        const section = document.querySelector<HTMLElement>(item.href);
        if (section && section.getBoundingClientRect().top <= marker) return index;
        return activeIndex;
      }, 0);
      setActiveNavIndex(currentIndex);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  React.useEffect(() => {
    const clearAnchorNavigation = () => {
      anchorNavigationTarget.current = null;
      if (anchorNavigationTimer.current !== null) {
        window.clearTimeout(anchorNavigationTimer.current);
        anchorNavigationTimer.current = null;
      }
    };
    const clearForKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(event.key)) clearAnchorNavigation();
    };

    window.addEventListener("wheel", clearAnchorNavigation, { passive: true });
    window.addEventListener("touchstart", clearAnchorNavigation, { passive: true });
    window.addEventListener("pointerdown", clearAnchorNavigation, { passive: true });
    window.addEventListener("keydown", clearForKey);
    return () => {
      window.removeEventListener("wheel", clearAnchorNavigation);
      window.removeEventListener("touchstart", clearAnchorNavigation);
      window.removeEventListener("pointerdown", clearAnchorNavigation);
      window.removeEventListener("keydown", clearForKey);
      if (anchorNavigationTimer.current !== null) window.clearTimeout(anchorNavigationTimer.current);
      if (navVisibilityTimer.current !== null) window.clearTimeout(navVisibilityTimer.current);
      if (themeTransitionTimer.current !== null) window.clearTimeout(themeTransitionTimer.current);
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const isMobile = window.matchMedia("(max-width: 1000px)").matches;
    if (navVisibilityTimer.current !== null) window.clearTimeout(navVisibilityTimer.current);
    if (latest <= 24) {
      setNavVisible(true);
    } else {
      setNavVisible(false);
      navVisibilityTimer.current = window.setTimeout(() => {
        setNavVisible(true);
        navVisibilityTimer.current = null;
      }, 700);
    }

    if (anchorNavigationTarget.current) {
      if (anchorNavigationTimer.current !== null) window.clearTimeout(anchorNavigationTimer.current);
      anchorNavigationTimer.current = window.setTimeout(() => {
        anchorNavigationTarget.current = null;
        anchorNavigationTimer.current = null;
      }, 350);
      lastScrollY.current = latest;
      return;
    }

    if (!isMobile && isExpanded && latest > previous && latest > 150) {
      setGooeyReady(false);
      setShowActiveGooeyPill(false);
      setExpanded(false);
    }

    lastScrollY.current = latest;
  });

  function handleNavClick(event: React.MouseEvent<HTMLElement>) {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (anchor && isExpanded) {
      if (navItems.some((item) => item.href === anchor.getAttribute("href"))) {
        setShowActiveGooeyPill(true);
      }
      anchorNavigationTarget.current = anchor.getAttribute("href");
      if (anchorNavigationTimer.current !== null) window.clearTimeout(anchorNavigationTimer.current);
      anchorNavigationTimer.current = null;
      setMobileMenuOpen(false);
      return;
    }

    if (!isExpanded) {
      event.preventDefault();
      setGooeyReady(false);
      setShowActiveGooeyPill(false);
      setExpanded(true);
    }
  }

  return (
    <div className={cn("floating-nav-wrap", transitionTheme && "floating-nav-wrap-theme-transition")}>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.08 } : undefined}
        whileTap={!isExpanded ? { scale: 0.96 } : undefined}
        onClickCapture={(event) => {
          if (!isExpanded) {
            event.preventDefault();
            event.stopPropagation();
            setGooeyReady(false);
            setShowActiveGooeyPill(false);
            setExpanded(true);
          }
        }}
        onClick={handleNavClick}
        onAnimationComplete={(definition) => {
          if (definition === "expanded" && isExpanded) {
            setGooeyLayoutVersion((version) => version + 1);
            setGooeyReady(true);
          }
        }}
        className={cn("floating-nav", !isExpanded && "floating-nav-collapsed", transitionTheme && "floating-nav-theme-transition")}
        aria-label="Navigasi utama"
        animate={navVisible ? isExpanded ? "expanded" : "collapsed" : "hidden"}
        style={{ pointerEvents: navVisible ? "auto" : "none" }}
      >
        <motion.a href="#home" variants={logoVariants} className="nav-monogram" aria-label="Kembali ke beranda">
          <Navigation aria-hidden="true" />
        </motion.a>

        <div
          className={cn(
            "floating-nav-links",
            !isExpanded && "floating-nav-links-disabled",
            (!gooeyReady || !showActiveGooeyPill) && "floating-nav-pill-hidden",
          )}
          data-mobile-open={mobileMenuOpen}
          style={{ pointerEvents: isExpanded ? "auto" : "none" }}
        >
          <GooeyNav
            items={navItems.map(({ name, href }) => ({ label: name, href }))}
            activeIndex={activeNavIndex}
            layoutVersion={gooeyLayoutVersion}
            showPill={gooeyReady && showActiveGooeyPill}
            onChange={(index) => {
              setActiveNavIndex(index);
              setShowActiveGooeyPill(true);
            }}
            theme={theme}
            color="#2563eb"
            activeTextColor="#ffffff"
            size="sm"
            frame={false}
            animationTime={520}
            particleCount={12}
            className="floating-gooey"
          />
        </div>

        <motion.div className="floating-nav-actions" variants={itemVariants}>
          <button
            className="nav-icon-button chat-icon-button"
            type="button"
            aria-label="Buka room chat"
            onClick={(event) => {
              event.stopPropagation();
              window.dispatchEvent(new Event("portfolio:open-chat"));
            }}
          >
            <MessageCircle aria-hidden="true" />
          </button>
          <button
            ref={themeButtonRef}
            className="nav-icon-button theme-icon-button"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (transitionTheme) return;
              const nextTheme = theme === "light" ? "dark" : "light";
              const bounds = themeButtonRef.current?.getBoundingClientRect();
              if (bounds) setThemeOrigin({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 });
              setTransitionPhase("expand");
              setTransitionTheme(nextTheme);
              if (themeTransitionTimer.current !== null) window.clearTimeout(themeTransitionTimer.current);
              themeTransitionTimer.current = window.setTimeout(() => {
                setTheme(nextTheme);
                document.documentElement.dataset.theme = nextTheme;
                window.localStorage.setItem("portfolio-theme", nextTheme);
                themeTransitionTimer.current = window.setTimeout(() => {
                  setTransitionPhase("contract");
                  themeTransitionTimer.current = window.setTimeout(() => {
                    setTransitionTheme(null);
                    themeTransitionTimer.current = null;
                  }, 420);
                }, 120);
              }, 520);
            }}
            aria-label="Toggle light/dark mode"
          >
            {theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </button>
          <button
            className="nav-icon-button nav-mobile-menu"
            type="button"
            aria-label={mobileMenuOpen ? "Tutup navigasi" : "Buka navigasi"}
            aria-expanded={mobileMenuOpen}
            onClick={(event) => {
              event.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
          >
            {mobileMenuOpen ? <span aria-hidden="true">×</span> : <Menu aria-hidden="true" />}
            <span className="nav-current-section">{isContactActive ? "CONTACT" : navItems[activeNavIndex]?.name ?? "ABOUT"}</span>
          </button>
          <a className="nav-contact-button" href="#contact" onClick={(event) => { event.stopPropagation(); setMobileMenuOpen(false); }}>
            Contact me <ArrowUpRight aria-hidden="true" />
          </a>
        </motion.div>

        <div className="floating-nav-collapsed-icon" aria-live="polite">
          <motion.div variants={collapsedIconVariants} animate={isExpanded ? "expanded" : "collapsed"}>
            <Menu aria-hidden="true" />
            <span>{isContactActive ? "CONTACT" : navItems[activeNavIndex]?.name ?? "ABOUT"}</span>
          </motion.div>
        </div>
      </motion.nav>
      {transitionTheme && typeof document !== "undefined" && createPortal(
        <div
          key={`${transitionTheme}-${themeOrigin.x}-${themeOrigin.y}`}
          className={`theme-transition-wipe${transitionPhase === "contract" ? " is-contracting" : " is-expanding"}`}
          style={{
            "--theme-origin-x": `${themeOrigin.x}px`,
            "--theme-origin-y": `${themeOrigin.y}px`,
            background: transitionTheme === "dark" ? "#0b1220" : "#f8fafc",
          } as React.CSSProperties}
          aria-hidden="true"
        />,
        document.body,
      )}
    </div>
  );
}