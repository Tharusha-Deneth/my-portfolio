import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./splash.css";

const letters = ["h", "e", "l", "l", "o"];

const letterContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.35,
    },
  },
};

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.88,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1], // Smooth organic easeOut
    },
  },
};

export default function SplashScreen({ onFinish }) {
  const [isExiting, setIsExiting] = useState(false);
  const [lettersFinished, setLettersFinished] = useState(false);

  const handleSkip = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 400);
  }, [onFinish]);

  useEffect(() => {
    // Prevent scrolling while splash screen is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Handle keypress to skip
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Total animation time for letters: 0.35s delay + 5 * 0.18s + 0.45s = ~1.7s
    const letterTimer = setTimeout(() => {
      setLettersFinished(true);
    }, 1500);

    // Hold the completed "hello" for a moment, then initiate smooth exit
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Completely dismiss splash after exit animation finishes
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3200);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(letterTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish, handleSkip]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="splash-screen"
          className="splash-container"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            filter: "blur(8px)",
            transition: {
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          onClick={handleSkip}
        >
          <div className="splash-content">
            <motion.div
              className="splash-hello-text"
              variants={letterContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {letters.map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="splash-letter"
                >
                  {char}
                </motion.span>
              ))}

              {/* Smooth breathing writing cursor that disappears when finished */}
              <motion.span
                className="splash-pen-cursor"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: lettersFinished ? 0 : 1,
                  scale: lettersFinished ? 0 : 1,
                }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          </div>

          <motion.div
            className="splash-skip-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              handleSkip();
            }}
          >
            Click anywhere to enter
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
