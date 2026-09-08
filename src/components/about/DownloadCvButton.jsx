import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileDown } from "lucide-react";
import confetti from "canvas-confetti";
import { CV_BASE64 } from "../../assets/cvBase64.js";

// Helper to trigger the real CV PDF download directly from binary bytes
function downloadRealCvPdf() {
  try {
    const binaryString = window.atob(CV_BASE64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "Tharusha_Deneth_CV.pdf";
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 2000);
  } catch (err) {
    console.error("Base64 download error, fallback to static file:", err);
    const link = document.createElement("a");
    link.href = "/th.pdf";
    link.download = "Tharusha_Deneth_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default function DownloadCvButton() {
  // 'idle' | 'gathering' | 'flying' | 'success'
  const [status, setStatus] = useState("idle");
  const buttonRef = useRef(null);

  const handleDownload = () => {
    if (status !== "idle") return;

    // Step 1: Text gathers and collapses into the center
    setStatus("gathering");

    setTimeout(() => {
      // Step 2: Morphs into arrow and accelerates left-to-right
      setStatus("flying");

      // Trigger the real CV PDF download from Tharusha's actual th.pdf
      downloadRealCvPdf();
    }, 320);

    setTimeout(() => {
      // Step 3: Enters Success state with celebration
      setStatus("success");

      // Trigger elegant celebration sparkles
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const originX = (rect.left + rect.width / 2) / window.innerWidth;
        const originY = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 35,
          spread: 60,
          origin: { x: originX, y: originY },
          colors: ["#ffffff", "#cbd5e1", "#38bdf8", "#34d399", "#f8fafc"],
          ticks: 200,
          gravity: 1.1,
          scalar: 0.85,
          disableForReducedMotion: true,
        });
      }
    }, 950);

    // Step 4: Reset back to idle state after 3.8 seconds
    setTimeout(() => {
      setStatus("idle");
    }, 4200);
  };

  return (
    <div className="cv-btn-container" ref={buttonRef}>
      <motion.button
        type="button"
        id="cv-download-btn"
        className={`cv-btn ${status}`}
        onClick={handleDownload}
        disabled={status !== "idle"}
        whileHover={status === "idle" ? { scale: 1.04 } : {}}
        whileTap={status === "idle" ? { scale: 0.97 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        aria-label="Download Tharusha Deneth CV"
      >
        {/* Animated luminous border sweep */}
        <span className="cv-btn-border-glow" />

        {/* Ambient background hover shimmer */}
        <span className="cv-btn-shimmer" />

        {/* --- STATE 1: IDLE / GATHERING --- */}
        {(status === "idle" || status === "gathering") && (
          <motion.div
            className="cv-btn-content"
            initial={{ opacity: 0 }}
            animate={
              status === "gathering"
                ? {
                    opacity: 0,
                    scale: 0.1,
                    letterSpacing: "-0.25em",
                    filter: "blur(6px)",
                    transition: { duration: 0.28, ease: "easeIn" },
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    letterSpacing: "0.02em",
                    filter: "blur(0px)",
                    transition: { duration: 0.3 },
                  }
            }
          >
            {/* Left Animated Download Icon */}
            <motion.span
              className="cv-btn-icon-box"
              animate={
                status === "idle"
                  ? { y: [0, -2, 0] }
                  : { scale: 0 }
              }
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            >
              <FileDown size={18} className="cv-icon-down" />
            </motion.span>

            {/* Button Main Text */}
            <span className="cv-btn-text">
              DOWNLOAD CV
            </span>
          </motion.div>
        )}

        {/* --- STEP 1b: ENERGY ORB AT CENTER WHEN TEXT COLLAPSES --- */}
        <AnimatePresence>
          {status === "gathering" && (
            <motion.div
              key="orb"
              className="cv-gather-orb"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 0.8], opacity: [0, 1, 0.8] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* --- STATE 2: FLYING ARROW (LEFT-TO-RIGHT SPEED SHOOT) --- */}
        <AnimatePresence>
          {status === "flying" && (
            <motion.div className="cv-flight-track" key="flight-track">
              {/* Glowing speed trail behind arrow */}
              <motion.div
                className="cv-speed-trail"
                initial={{ width: 0, opacity: 0, x: -30 }}
                animate={{
                  width: [0, 90, 140, 0],
                  opacity: [0, 0.9, 0.6, 0],
                  x: [-30, 40, 130, 240],
                }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              />

              {/* The Aerodynamic Arrow moving from left to right */}
              <motion.div
                className="cv-rocket-arrow"
                initial={{ x: -40, opacity: 0, scale: 0.6 }}
                animate={{
                  x: [-40, 10, 110, 240],
                  opacity: [0, 1, 1, 0],
                  scale: [0.6, 1.15, 1.1, 0.8],
                }}
                transition={{
                  duration: 0.62,
                  times: [0, 0.25, 0.7, 1],
                  ease: [0.2, 0.8, 0.4, 1],
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cv-arrow-svg"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- STATE 3: SUCCESS ANIMATION --- */}
        <AnimatePresence>
          {status === "success" && (
            <motion.div
              key="success-content"
              className="cv-btn-success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
            >
              {/* Checkmark circle */}
              <div className="cv-success-icon-wrap">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cv-check-svg"
                >
                  <motion.path
                    d="M20 6L9 17L4 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </svg>
              </div>

              {/* Success label */}
              <span className="cv-success-text">
                SUCCESS!
              </span>

              <span className="cv-success-sub">
                CV Downloaded
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
