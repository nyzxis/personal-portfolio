"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch / mobile devices
    if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive =
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("[role='button']") ||
        target.classList.contains("cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Trailing Glowing Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none border will-change-transform"
        animate={{
          x: mousePosition.x - (isHovered ? 26 : 18),
          y: mousePosition.y - (isHovered ? 26 : 18),
          width: isHovered ? 52 : 36,
          height: isHovered ? 52 : 36,
          scale: isClicked ? 0.85 : 1,
          borderColor: isHovered
            ? "rgba(56, 189, 248, 0.9)"
            : "rgba(255, 255, 255, 0.4)",
          backgroundColor: isHovered
            ? "rgba(56, 189, 248, 0.12)"
            : "rgba(255, 255, 255, 0.03)",
          boxShadow: isHovered
            ? "0 0 20px rgba(56, 189, 248, 0.45)"
            : "0 0 8px rgba(255, 255, 255, 0.1)",
        }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 28,
          mass: 0.5,
        }}
      />

      {/* Inner Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-sky-400 pointer-events-none shadow-[0_0_8px_rgba(56,189,248,0.9)] will-change-transform"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isClicked ? 0.6 : isHovered ? 1.4 : 1,
          backgroundColor: isHovered ? "#38bdf8" : "#ffffff",
        }}
        transition={{
          type: "spring",
          stiffness: 1200,
          damping: 50,
        }}
      />
    </div>
  );
}
