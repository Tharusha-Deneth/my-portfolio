import { motion } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import "./themeToggle.css";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className={`theme-round-btn ${isDark ? "theme-dark" : "theme-light"} ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
    >
      {/* Ambient background glow ring */}
      <span className="theme-toggle-glow" />

      {/* Animated SVG Morph Icon */}
      <div className="theme-icon-container">
        <svg
          viewBox="0 0 32 32"
          className="theme-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* DEFINITIONS FOR GRADIENTS */}
          <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ================= SUN RAYS (Visible in Light Mode) ================= */}
          <motion.g
            animate={{
              rotate: isDark ? -90 : 0,
              scale: isDark ? 0 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 18,
            }}
            style={{ transformOrigin: "16px 16px" }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 16 + Math.cos(rad) * 9.5;
              const y1 = 16 + Math.sin(rad) * 9.5;
              const x2 = 16 + Math.cos(rad) * 12.8;
              const y2 = 16 + Math.sin(rad) * 12.8;
              return (
                <motion.line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#sunGradient)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  animate={{
                    opacity: isDark ? 0 : [0.8, 1, 0.8],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    delay: i * 0.12,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </motion.g>

          {/* ================= CELESTIAL STARS (Visible in Dark Mode) ================= */}
          <motion.g
            animate={{
              opacity: isDark ? 1 : 0,
              scale: isDark ? 1 : 0.2,
              rotate: isDark ? 0 : 45,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 20,
              delay: isDark ? 0.08 : 0,
            }}
            style={{ transformOrigin: "16px 16px" }}
          >
            {/* Star 1 - Top Left */}
            <motion.path
              d="M7 6L7.6 7.8L9.4 8.4L7.6 9L7 10.8L6.4 9L4.6 8.4L6.4 7.8L7 6Z"
              fill="#fef08a"
              animate={
                isDark
                  ? {
                      scale: [0.9, 1.25, 0.9],
                      opacity: [0.7, 1, 0.7],
                    }
                  : {}
              }
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            />

            {/* Star 2 - Top Right */}
            <motion.path
              d="M25 7L25.5 8.2L26.7 8.7L25.5 9.2L25 10.4L24.5 9.2L23.3 8.7L24.5 8.2L25 7Z"
              fill="#38bdf8"
              animate={
                isDark
                  ? {
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8],
                    }
                  : {}
              }
              transition={{
                repeat: Infinity,
                duration: 2.4,
                delay: 0.6,
                ease: "easeInOut",
              }}
            />

            {/* Star 3 - Bottom Left */}
            <motion.path
              d="M8 22L8.5 23.2L9.7 23.7L8.5 24.2L8 25.4L7.5 24.2L6.3 23.7L7.5 23.2L8 22Z"
              fill="#e879f9"
              animate={
                isDark
                  ? {
                      scale: [0.85, 1.2, 0.85],
                      opacity: [0.6, 1, 0.6],
                    }
                  : {}
              }
              transition={{
                repeat: Infinity,
                duration: 1.9,
                delay: 1.1,
                ease: "easeInOut",
              }}
            />
          </motion.g>

          {/* ================= CORE ORB: MORPHS BETWEEN SUN & MOON ================= */}
          <motion.g
            animate={{
              rotate: isDark ? 0 : 360,
            }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 18,
            }}
            style={{ transformOrigin: "16px 16px" }}
          >
            {/* SUN CORE (Shown in Light Mode) */}
            <motion.circle
              cx="16"
              cy="16"
              r="6.2"
              fill="url(#sunGradient)"
              filter="url(#sunGlow)"
              animate={{
                opacity: isDark ? 0 : 1,
                scale: isDark ? 0.4 : 1,
              }}
              transition={{ duration: 0.35 }}
            />

            {/* MOON CRESCENT (Shown in Dark Mode) */}
            <motion.path
              d="M19.5 7.5C14.8056 7.5 11 11.3056 11 16C11 20.6944 14.8056 24.5 19.5 24.5C21.4393 24.5 23.228 23.85 24.6644 22.756C19.2 22.4 15 17.8 15 12.5C15 10.5 15.65 8.7 16.8 7.3C17.65 7.4 18.55 7.5 19.5 7.5Z"
              fill="url(#moonGradient)"
              filter="url(#moonGlow)"
              animate={{
                opacity: isDark ? 1 : 0,
                scale: isDark ? 1 : 0.4,
              }}
              transition={{ duration: 0.35 }}
            />

            {/* Moon Craters */}
            <motion.circle
              cx="17.2"
              cy="15.8"
              r="1.2"
              fill="#94a3b8"
              opacity={isDark ? 0.45 : 0}
              animate={{
                opacity: isDark ? 0.45 : 0,
                scale: isDark ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.circle
              cx="19.5"
              cy="19.2"
              r="0.9"
              fill="#94a3b8"
              opacity={isDark ? 0.4 : 0}
              animate={{
                opacity: isDark ? 0.4 : 0,
                scale: isDark ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.circle
              cx="18.2"
              cy="11.5"
              r="0.75"
              fill="#94a3b8"
              opacity={isDark ? 0.35 : 0}
              animate={{
                opacity: isDark ? 0.35 : 0,
                scale: isDark ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.g>
        </svg>
      </div>
    </motion.button>
  );
}
