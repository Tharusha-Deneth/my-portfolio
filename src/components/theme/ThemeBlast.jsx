import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeBlast() {
  const { blastState } = useTheme();

  const particles = useMemo(() => {
    // Generate 16 radial explosion spark particles
    return Array.from({ length: 16 }).map((_, i) => {
      const angle = (i / 16) * 360 + (Math.random() * 15 - 7.5);
      const rad = (angle * Math.PI) / 180;
      const distance = 80 + Math.random() * 120;
      return {
        id: i,
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 0.05,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blastState.key]);

  const isLightTarget = blastState.targetTheme === "light";

  return (
    <AnimatePresence>
      {blastState.active && (
        <div
          key={blastState.key}
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 99999,
            overflow: "hidden",
          }}
        >
          {/* Main Expanding Shockwave Wave */}
          <motion.div
            initial={{
              width: 0,
              height: 0,
              opacity: 0.95,
              scale: 0,
            }}
            animate={{
              width: "max(260vw, 260vh)",
              height: "max(260vw, 260vh)",
              opacity: [0.95, 0.85, 0],
              scale: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.82,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: "absolute",
              left: blastState.origin.x,
              top: blastState.origin.y,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: isLightTarget
                ? "radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.8) 45%, rgba(245, 158, 11, 0.35) 75%, transparent 100%)"
                : "radial-gradient(circle, rgba(0, 0, 0, 0.98) 0%, rgba(15, 23, 42, 0.85) 45%, rgba(168, 85, 247, 0.4) 75%, transparent 100%)",
              boxShadow: isLightTarget
                ? "0 0 60px rgba(251, 191, 36, 0.8), 0 0 120px rgba(255, 255, 255, 0.9)"
                : "0 0 60px rgba(168, 85, 247, 0.8), 0 0 120px rgba(99, 102, 241, 0.6)",
              willChange: "transform, opacity",
            }}
          />

          {/* Shockwave Outer Ring Pulse */}
          <motion.div
            initial={{
              width: 0,
              height: 0,
              opacity: 1,
              borderWidth: "5px",
            }}
            animate={{
              width: "max(280vw, 280vh)",
              height: "max(280vw, 280vh)",
              opacity: [1, 0.7, 0],
              borderWidth: "1px",
            }}
            transition={{
              duration: 0.88,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: "absolute",
              left: blastState.origin.x,
              top: blastState.origin.y,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              borderStyle: "solid",
              borderColor: isLightTarget
                ? "rgba(251, 191, 36, 0.9)"
                : "rgba(192, 132, 252, 0.9)",
              boxShadow: isLightTarget
                ? "0 0 30px rgba(251, 191, 36, 0.9), inset 0 0 20px rgba(255, 255, 255, 0.8)"
                : "0 0 30px rgba(168, 85, 247, 0.9), inset 0 0 20px rgba(56, 189, 248, 0.8)",
              pointerEvents: "none",
            }}
          />

          {/* Radial Particle Blast Sparks */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: blastState.origin.x,
                y: blastState.origin.y,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: blastState.origin.x + p.x * 2.2,
                y: blastState.origin.y + p.y * 2.2,
                scale: [0, 1.4, 0],
                opacity: [1, 0.9, 0],
              }}
              transition={{
                duration: 0.65,
                delay: p.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "absolute",
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: "50%",
                background: isLightTarget
                  ? "radial-gradient(circle, #ffffff 0%, #f59e0b 100%)"
                  : "radial-gradient(circle, #c084fc 0%, #38bdf8 100%)",
                boxShadow: isLightTarget
                  ? "0 0 10px #f59e0b, 0 0 20px #fbbf24"
                  : "0 0 10px #c084fc, 0 0 20px #38bdf8",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
