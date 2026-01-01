"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { siteConfig } from "@/config/site.config";
import { ThemeToggle, HeroCard, WelcomeCard, LinksCard, ContactCard } from "@/components";
import { Canvas } from "@react-three/fiber";
import { View, Environment } from "@react-three/drei";
import { Orbs } from "@/components/scene/Orbs";
import { RealGlassProvider } from "@/components/providers/RealGlassProvider";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Visibility state for dynamic unmounting (performance & strict isolation)
  const [visibleSections, setVisibleSections] = useState({
    hero: true,
    welcome: false,
    links: false,
    contact: false,
  });

  // Auto-scroll state
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const autoScrollRef = useRef<number | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Footer visibility
  const [footerVisible, setFooterVisible] = useState(false);

  // Track visibility with slight overlap for smooth crossfades
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const newVisible = {
      hero: latest < 0.16, // Ends at 0.15
      welcome: latest > 0.13 && latest < 0.49, // Starts 0.14, Ends 0.48
      links: latest > 0.49 && latest < 0.74, // Starts 0.50, Ends 0.73
      contact: latest > 0.74, // Starts 0.75
    };

    if (
      newVisible.hero !== visibleSections.hero ||
      newVisible.welcome !== visibleSections.welcome ||
      newVisible.links !== visibleSections.links ||
      newVisible.contact !== visibleSections.contact
    ) {
      setVisibleSections(newVisible);
    }

    setFooterVisible(latest > 0.92);

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      setIsAutoScrolling(false);
    }
    if (latest < 0.98) {
      idleTimerRef.current = setTimeout(startAutoScroll, 4000);
    }
  });

  const startAutoScroll = () => {
    setIsAutoScrolling(true);
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (window.scrollY < document.body.scrollHeight - window.innerHeight - 10) {
        window.scrollBy(0, scrollSpeed);
        autoScrollRef.current = requestAnimationFrame(scroll);
      } else {
        setIsAutoScrolling(false);
      }
    };
    autoScrollRef.current = requestAnimationFrame(scroll);
  };

  useEffect(() => {
    idleTimerRef.current = setTimeout(startAutoScroll, 4000);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (autoScrollRef.current) cancelAnimationFrame(autoScrollRef.current);
    };
  }, []);

  // --- Animation Transforms ---
  const hiOpacity = useTransform(scrollYProgress, [0.03, 0.06, 0.12, 0.15], [0, 1, 1, 0]);
  const hiScale = useTransform(scrollYProgress, [0.03, 0.06, 0.12, 0.15], [0.9, 1, 1, 0.95]);
  const hiRotateX = useTransform(scrollYProgress, [0.03, 0.06, 0.12, 0.15], [-10, 0, 0, 10]);
  const hiY = useTransform(scrollYProgress, [0.03, 0.06, 0.12, 0.15], [40, 0, 0, -30]);

  const welcomeOpacity = useTransform(scrollYProgress, [0.14, 0.17, 0.44, 0.48], [0, 1, 1, 0]);
  const welcomeScale = useTransform(scrollYProgress, [0.14, 0.17, 0.44, 0.48], [0.9, 1, 1, 0.95]);
  const welcomeRotateX = useTransform(scrollYProgress, [0.14, 0.17, 0.44, 0.48], [-10, 0, 0, 10]);
  const welcomeY = useTransform(scrollYProgress, [0.14, 0.17, 0.44, 0.48], [40, 0, 0, -30]);

  const linksOpacity = useTransform(scrollYProgress, [0.50, 0.53, 0.70, 0.73], [0, 1, 1, 0]);
  const linksScale = useTransform(scrollYProgress, [0.50, 0.53, 0.70, 0.73], [0.9, 1, 1, 0.95]);
  const linksRotateX = useTransform(scrollYProgress, [0.50, 0.53, 0.70, 0.73], [-10, 0, 0, 10]);
  const linksY = useTransform(scrollYProgress, [0.50, 0.53, 0.70, 0.73], [40, 0, 0, -30]);

  const contactOpacity = useTransform(scrollYProgress, [0.75, 0.78, 0.95, 0.98], [0, 1, 1, 0.8]);
  const contactScale = useTransform(scrollYProgress, [0.75, 0.78, 0.95], [0.9, 1, 1]);
  const contactRotateX = useTransform(scrollYProgress, [0.75, 0.78, 0.95], [-10, 0, 0]);
  const contactY = useTransform(scrollYProgress, [0.75, 0.78], [40, 0]);

  const cardStyle = {
    position: "absolute" as const,
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 520,
    display: "flex",
    justifyContent: "center",
    zIndex: 10,
  };

  return (
    <RealGlassProvider>
      <div ref={scrollContainerRef} className="relative w-full h-full">
        <div className="background">
          {/* CSS Orbs replaced by R3F Orbs */}
        </div>

        <ThemeToggle />

        <div ref={containerRef} className="scroll-container">
          <div className="sticky-viewport">

            {visibleSections.hero && (
              <motion.div style={{ ...cardStyle, opacity: hiOpacity, scale: hiScale, rotateX: hiRotateX, y: hiY }}>
                <HeroCard />
              </motion.div>
            )}

            {visibleSections.welcome && (
              <motion.div style={{ ...cardStyle, opacity: welcomeOpacity, scale: welcomeScale, y: welcomeY }}>
                <WelcomeCard scrollYProgress={scrollYProgress} rotateX={welcomeRotateX} />
              </motion.div>
            )}

            {visibleSections.links && (
              <motion.div style={{ ...cardStyle, opacity: linksOpacity, scale: linksScale, y: linksY }}>
                <LinksCard scrollYProgress={scrollYProgress} rotateX={linksRotateX} />
              </motion.div>
            )}

            {visibleSections.contact && (
              <motion.div style={{ ...cardStyle, opacity: contactOpacity, scale: contactScale, y: contactY }}>
                <ContactCard scrollYProgress={scrollYProgress} rotateX={contactRotateX} />
              </motion.div>
            )}

          </div>
        </div>

        <footer className={`footer ${footerVisible ? "footer--visible" : ""}`}>
          <p>{siteConfig.footer.copyright}</p>
        </footer>

        {/* R3F Overlay for Glass and Orbs */}
        <Canvas
          className="pointer-events-none fixed inset-0"
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
          eventSource={scrollContainerRef as any}
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <View.Port />
          {/* Global Scene Elements */}
          <ambientLight intensity={0.5} />
          <Environment preset="city" />
          <Orbs />
        </Canvas>
      </div>
    </RealGlassProvider>
  );
}
