import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { CheckCircle2, RotateCcw, Send, AlertTriangle, MailCheck } from "lucide-react";
import "./envelopeAnimation.css";

// Gentle Web Audio sound synthesizer for realistic paper & whoosh effects
const playEnvelopeSound = (type) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "fold") {
      // Paper crisp rustle
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "seal") {
      // Wax seal thud
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "whoosh") {
      // High-speed air whoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.4);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "success") {
      // Harmonic success chime
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.04, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    }
  } catch {
    // Audio context may be restricted before user interaction
  }
};

export default function EnvelopeAnimation({
  phase, // 'idle' | 'folding' | 'inserting' | 'sealing' | 'flying' | 'success' | 'error'
  formData,
  onReset,
  errorMessage,
}) {
  const confettiFired = useRef(false);

  // Trigger celebration effects on success
  useEffect(() => {
    if (phase === "success" && !confettiFired.current) {
      confettiFired.current = true;
      playEnvelopeSound("success");

      // Emerald, mint, gold, and vibrant rose confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.65 },
          colors: ["#10b981", "#34d399", "#fbbf24", "#e11d48", "#ffffff"],
        });

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0.15, y: 0.7 },
            colors: ["#10b981", "#6ee7b7", "#f59e0b"],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 0.85, y: 0.7 },
            colors: ["#10b981", "#6ee7b7", "#ec4899"],
          });
        }, 250);
      } catch {
        // Fallback gracefully if canvas context fails
      }
    }

    if (phase === "folding") {
      confettiFired.current = false;
      playEnvelopeSound("fold");
    } else if (phase === "sealing") {
      playEnvelopeSound("seal");
    } else if (phase === "flying") {
      playEnvelopeSound("whoosh");
    }
  }, [phase]);

  // If idle, don't show the overlay/journey container
  if (phase === "idle") return null;

  return (
    <div className="envelope-journey-stage">
      {/* 3D ENVELOPE JOURNEY PHASES */}
      <AnimatePresence mode="wait">
        {/* ================= STAGE 1, 2, 3, 4: FOLDING, INSERTING, SEALING, FLYING ================= */}
        {["folding", "inserting", "sealing", "flying"].includes(phase) && (
          <motion.div
            key="envelope-flight"
            className="envelope-flight-viewport"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
          >
            {/* Speed warp streaks in flying phase */}
            {phase === "flying" && (
              <div className="speed-lines-container">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="speed-line"
                    style={{
                      left: `${(i / 12) * 100}%`,
                      animationDelay: `${(i % 4) * 0.08}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Status indicator pill at top */}
            <motion.div
              className="journey-status-pill"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="journey-status-dot" />
              <span className="journey-status-text">
                {phase === "folding" && "Folding letter..."}
                {phase === "inserting" && "Placing inside envelope..."}
                {phase === "sealing" && "Applying official wax seal..."}
                {phase === "flying" && "Dispatching to Tharusha's inbox..."}
              </span>
            </motion.div>

            {/* 3D WORLD CONTAINER */}
            <div className="envelope-3d-scene">
              {/* THE LETTER (Folds, compresses, and drops into envelope) */}
              <motion.div
                className={`letter-sheet ${phase === "folding" ? "folding" : ""} ${
                  phase === "inserting" || phase === "sealing" || phase === "flying"
                    ? "inserted"
                    : ""
                }`}
                initial={{ y: 0, scale: 0.98, opacity: 1 }}
                animate={
                  phase === "folding"
                    ? { y: -15, scale: 0.92, rotateX: 12, opacity: 1 }
                    : phase === "inserting"
                    ? { y: 65, scale: 0.78, opacity: 0.85 }
                    : { y: 120, scale: 0.65, opacity: 0 }
                }
                transition={{
                  duration: phase === "inserting" ? 0.75 : 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Airmail header stripe */}
                <div className="letter-airmail-stripes" />

                <div className="letter-header">
                  <div className="letter-stamp">
                    <span className="stamp-icon">✈</span>
                    <span className="stamp-text">AIRMAIL</span>
                  </div>
                  <div className="letter-postmark">
                    <span>POSTAL SERVICE</span>
                    <span>EXPRESS</span>
                  </div>
                </div>

                <div className="letter-body">
                  <div className="letter-to-from">
                    <div className="letter-line-item">
                      <span className="line-label">FROM:</span>
                      <span className="line-value">{formData.name || "Sender"}</span>
                    </div>
                    <div className="letter-line-item">
                      <span className="line-label">EMAIL:</span>
                      <span className="line-value">{formData.email || "sender@domain.com"}</span>
                    </div>
                    <div className="letter-line-item">
                      <span className="line-label">TO:</span>
                      <span className="line-value">Tharusha Deneth (Developer)</span>
                    </div>
                  </div>

                  <div className="letter-content-preview">
                    <p className="letter-message-quote">
                      &ldquo;{formData.message ? formData.message.slice(0, 110) : "Message content"}
                      {(formData.message?.length || 0) > 110 ? "..." : ""}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Simulated folding crease lines */}
                <div className="letter-crease letter-crease-top" />
                <div className="letter-crease letter-crease-bottom" />
              </motion.div>

              {/* THE 3D ENVELOPE */}
              <motion.div
                className="envelope-container"
                initial={{ y: 80, opacity: 0, scale: 0.9 }}
                animate={
                  phase === "folding"
                    ? { y: 60, opacity: 0.85, scale: 0.95 }
                    : phase === "inserting"
                    ? { y: 20, opacity: 1, scale: 1, rotateX: 5 }
                    : phase === "sealing"
                    ? { y: 0, opacity: 1, scale: 1, rotateX: 0 }
                    : {
                        // Flying phase: "patta edala gannu vge ethulata edala eran"
                        y: -320,
                        x: 180,
                        scale: 0.25,
                        rotateZ: -28,
                        rotateY: 45,
                        opacity: 0,
                        transition: {
                          duration: 0.9,
                          ease: [0.12, 0, 0.39, 0], // accelerating suction curve
                        },
                      }
                }
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Envelope Back Wall */}
                <div className="envelope-back" />

                {/* Envelope Interior Lining */}
                <div className="envelope-interior" />

                {/* Envelope Front Pocket (Lower triangles) */}
                <div className="envelope-front-pocket" />

                {/* Envelope Top Flap with 3D Flip */}
                <motion.div
                  className={`envelope-top-flap ${
                    phase === "sealing" || phase === "flying" ? "closed" : "open"
                  }`}
                  animate={
                    phase === "sealing" || phase === "flying"
                      ? { rotateX: 180 }
                      : { rotateX: 0 }
                  }
                  transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                />

                {/* WAX SEAL (Appears during sealing and stays during flight) */}
                <AnimatePresence>
                  {(phase === "sealing" || phase === "flying") && (
                    <motion.div
                      className="envelope-wax-seal"
                      initial={{ scale: 2.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 18,
                        delay: 0.15,
                      }}
                    >
                      <div className="wax-seal-inner">
                        <span className="wax-crest">TD</span>
                      </div>
                      {/* Seal Spark Particles */}
                      <span className="seal-spark seal-spark-1" />
                      <span className="seal-spark seal-spark-2" />
                      <span className="seal-spark seal-spark-3" />
                      <span className="seal-spark seal-spark-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ================= STAGE 5: SUCCESS STATE (Green Celebration) ================= */}
        {phase === "success" && (
          <div className="success-wrapper">
            {/* Blurred Backdrop Dimmer to blur the background illustration */}
            <motion.div
              className="card-backdrop-dimmer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />

            <motion.div
              key="success-card"
              className="success-celebration-card"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {/* Animated Glowing Checkmark Badge (Clean vertical size, no empty top space) */}
              <div className="success-icon-badge-wrapper">
                <motion.div
                  className="success-icon-pulse-ring"
                  animate={{ scale: [1, 1.35, 1.45], opacity: [0.75, 0.25, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                  className="success-icon-circle"
                  initial={{ scale: 0, rotate: -25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 360, damping: 18, delay: 0.1 }}
                >
                  <motion.svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M20 6L9 17l-5-5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45, delay: 0.25, ease: "easeOut" }}
                    />
                  </motion.svg>
                </motion.div>
              </div>

              {/* Glowing Success Badge */}
              <div className="success-badge-tag">
                <MailCheck size={14} />
                <span>DELIVERED DIRECTLY TO GMAIL</span>
              </div>

              {/* Main Title centered */}
              <h2 className="success-title">Message Sent Successfully!</h2>

              {/* Description centered */}
              <p className="success-description">
                Thank you, <strong className="success-name">{formData.name || "Friend"}</strong>!
                Your message has been securely sent to <strong>sdeneth72@gmail.com</strong>.
                Tharusha will review your note and respond to <em>{formData.email}</em> shortly.
              </p>

              {/* Delivery Details Receipt Card */}
              <div className="success-receipt">
                <div className="receipt-row">
                  <span className="receipt-label">Recipient</span>
                  <span className="receipt-value">sdeneth72@gmail.com</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Sender</span>
                  <span className="receipt-value">{formData.name || "Anonymous"}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Status</span>
                  <span className="receipt-value receipt-status-ok">
                    <CheckCircle2 size={13} /> Verified by EmailJS
                  </span>
                </div>
              </div>

              {/* Centered Action Button */}
              <motion.button
                type="button"
                onClick={onReset}
                className="send-another-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <RotateCcw size={15} />
                <span>Send Another Message</span>
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* ================= STAGE 6: ERROR STATE ================= */}
        {phase === "error" && (
          <div className="success-wrapper">
            <motion.div
              className="card-backdrop-dimmer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />

            <motion.div
              key="error-card"
              className="error-celebration-card"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {/* Animated Error Badge */}
              <div className="error-icon-badge-wrapper">
                <motion.div
                  className="error-icon-pulse-ring"
                  animate={{ scale: [1, 1.35, 1.45], opacity: [0.75, 0.25, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                  className="error-icon-circle"
                  initial={{ scale: 0, rotate: 25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 360, damping: 18, delay: 0.1 }}
                >
                  <motion.svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </motion.svg>
                </motion.div>
              </div>

              <div className="error-badge-tag">
                <AlertTriangle size={14} />
                <span>DELIVERY ISSUE DETECTED</span>
              </div>

              <h2 className="error-title">Couldn&apos;t Send Message</h2>

              <p className="error-description">
                {errorMessage || "We encountered a temporary network glitch while communicating with EmailJS."}
                <br />
                Don&apos;t worry, your message has been preserved so you don&apos;t have to re-type it!
              </p>

              <motion.button
                type="button"
                onClick={onReset}
                className="retry-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Send size={15} />
                <span>Try Again</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
