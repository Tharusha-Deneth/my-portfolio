import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

export default function CircularDownloadBtn({ artwork, onDownload, size = 52 }) {
  const [downloadState, setDownloadState] = useState("idle"); // "idle" | "downloading" | "completed"
  const [progress, setProgress] = useState(0);
  const animRef = useRef(null);

  // SVG Circular path math
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleClick = (e) => {
    e.stopPropagation();
    if (downloadState !== "idle") return;

    setDownloadState("downloading");
    setProgress(0);

    const startTime = performance.now();
    const duration = 1200; // 1.2s smooth animated ring fill

    const step = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        animRef.current = requestAnimationFrame(step);
      } else {
        // Completed: trigger download and show checkmark
        if (onDownload) {
          onDownload(artwork);
        }
        setDownloadState("completed");
        setTimeout(() => {
          setDownloadState("idle");
          setProgress(0);
        }, 2200);
      }
    };

    animRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <motion.button
      type="button"
      className="circular-download-btn"
      onClick={handleClick}
      title={downloadState === "completed" ? "Downloaded!" : "Download Artwork"}
      aria-label="Download Artwork"
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      {/* SVG Progress Ring */}
      <svg
        className="circular-download-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="download-track-circle"
          strokeWidth={strokeWidth}
        />
        {/* Animated Progress circle */}
        {downloadState === "downloading" && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="download-progress-circle"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Button Center Icon Content */}
      <div className="circular-download-icon-wrap">
        <AnimatePresence mode="wait">
          {downloadState === "completed" ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              style={{ color: "#10b981" }}
            >
              <Check size={20} strokeWidth={3} />
            </motion.div>
          ) : downloadState === "downloading" ? (
            <motion.div
              key="downloading"
              className="download-progress-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span>{progress}%</span>
            </motion.div>
          ) : (
            /* Idle: Animated Arrow Dropping down */
            <motion.div
              key="arrow"
              className="download-arrow-carrier"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Dropping arrow path */}
              <motion.svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Arrow stem and head */}
                <motion.path
                  d="M12 3v12m0 0l-4-4m4 4l4-4"
                  animate={{ y: [0, 2.5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "easeInOut",
                  }}
                />
                {/* Tray baseline */}
                <path d="M5 20h14" />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
