import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import "./about.css";

const aboutText =
  "As an undergraduate Full Stack Developer, I specialize in building responsive web applications and secure systems. I truly enjoy collaborating with clients to deliver high-performance digital experiences that stand out. Let's build something incredible together!";

const words = aboutText.split(" ");

// Individual word component that transitions from dark gray to bright glowing white on scroll
const ScrollWord = ({ word, range, progress }) => {
  const opacity = useTransform(progress, range, [0.22, 1]);
  const color = useTransform(progress, range, ["#52525b", "#ffffff"]);
  const textShadow = useTransform(progress, range, [
    "0 0 0px rgba(255, 255, 255, 0)",
    "0 0 10px rgba(255, 255, 255, 0.55)",
  ]);

  return (
    <span className="about-word-wrap">
      <motion.span
        style={{
          opacity,
          color,
          textShadow,
          display: "inline-block",
        }}
      >
        {word}
      </motion.span>
      <span>&nbsp;</span>
    </span>
  );
};

export default function About() {
  const containerRef = useRef(null);

  // Track scroll position through the about section track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Dual-side blur transition:
  // When scrolling down from the hero into about, or exiting to tech stack,
  // both sides blur and pull back / clear as you enter or leave the section.
  const sideBlurOpacity = useTransform(
    smoothProgress, 
    [0, 0.12, 0.22, 0.82, 0.92, 1], 
    [1, 0.7, 0, 0, 0.7, 1]
  );
  const sideBlurScaleX = useTransform(
    smoothProgress, 
    [0, 0.12, 0.22, 0.82, 0.92, 1], 
    [1.4, 1, 0.4, 0.4, 1, 1.4]
  );

  // Video entrance and exit animation: de-blur and subtle zoom into crisp focus, then blur on exit
  const videoFilter = useTransform(
    smoothProgress,
    [0, 0.14, 0.86, 1],
    [
      "blur(16px) brightness(0.7)", 
      "blur(0px) brightness(1)", 
      "blur(0px) brightness(1)", 
      "blur(16px) brightness(0.7)"
    ]
  );
  const videoScale = useTransform(
    smoothProgress, 
    [0, 0.15, 0.85, 1], 
    [1.1, 1, 1, 1.1]
  );

  // Content entrance & exit: slides in from left hidden & blurred, clears, then exits blurred to left
  const contentX = useTransform(
    smoothProgress, 
    [0, 0.14, 0.86, 1], 
    [-80, 0, 0, -80]
  );
  const contentFilter = useTransform(
    smoothProgress,
    [0, 0.14, 0.86, 1],
    ["blur(16px)", "blur(0px)", "blur(0px)", "blur(16px)"]
  );
  const contentOpacity = useTransform(
    smoothProgress, 
    [0, 0.1, 0.88, 1], 
    [0, 1, 1, 0]
  );

  return (
    <div className="about-section font-geist" ref={containerRef} id="about">
      <div className="about-sticky">
        {/* Looping Ambient Background Video with Entrance De-blur */}
        <motion.video
          className="about-video-bg"
          autoPlay
          muted
          loop
          playsInline
          style={{
            filter: videoFilter,
            scale: videoScale,
          }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4"
        />

        {/* Ambient Dark Gradient Vignette for Contrast */}
        <div className="about-video-overlay" />

        {/* Left Side Blur Wing - Animates on transition from main section */}
        <motion.div
          className="about-side-blur about-side-blur-left"
          style={{
            opacity: sideBlurOpacity,
            scaleX: sideBlurScaleX,
          }}
        />

        {/* Right Side Blur Wing - Animates on transition from main section */}
        <motion.div
          className="about-side-blur about-side-blur-right"
          style={{
            opacity: sideBlurOpacity,
            scaleX: sideBlurScaleX,
          }}
        />

        {/* Left-Aligned Text Content (Positioned further left) */}
        <motion.div
          className="about-content-left"
          style={{
            x: contentX,
            filter: contentFilter,
            opacity: contentOpacity,
          }}
        >
          <h2 className="about-heading">
            ABOUT ME
          </h2>

          {/* Left-Aligned Paragraph with Word-by-Word Scroll Whitening */}
          <div className="about-paragraph">
            {words.map((word, i) => {
              const total = words.length;
              const start = 0.08 + (i / total) * 0.72;
              const end = start + (1.4 / total) * 0.72;

              return (
                <ScrollWord
                  key={i}
                  word={word}
                  range={[start, end]}
                  progress={smoothProgress}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
