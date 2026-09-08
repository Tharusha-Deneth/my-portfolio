import "./contact.css";
import emailjs from "@emailjs/browser";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import ContactSvg from "./ContactSvg";
import EnvelopeAnimation from "./EnvelopeAnimation";

// EmailJS Credentials with guaranteed fallback to user's provided keys
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID || "service_krh5h5j";
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID || "template_8bgrexo";
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY || "lcGsNSZWBwrY1uTf4";

// Initialize EmailJS early
try {
  emailjs.init({ publicKey: PUBLIC_KEY });
} catch {
  // Graceful fallback
}

// Left side entrance variant (form)
const leftContactVariant = {
  initial: {
    x: -35,
    opacity: 0,
    filter: "blur(12px)",
  },
  animate: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
    },
  },
};

// Right side entrance variant (svg illustration)
const rightContactVariant = {
  initial: {
    x: 35,
    opacity: 0,
    filter: "blur(12px)",
  },
  animate: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const itemVariant = {
  initial: {
    y: 20,
    opacity: 0,
    filter: "blur(8px)",
  },
  animate: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Animation sequence phase: 'idle' | 'folding' | 'inserting' | 'sealing' | 'flying' | 'success' | 'error'
  const [phase, setPhase] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const ref = useRef(null);
  const formRef = useRef(null);
  const timersRef = useRef([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    // Clear any previous timers
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    // Step 1: Start Folding Letter immediately
    setPhase("folding");
    setErrorMessage("");

    // Prepare comprehensive template params covering all EmailJS naming conventions
    const templateParams = {
      name: formData.name,
      user_username: formData.name,
      from_name: formData.name,
      email: formData.email,
      user_email: formData.email,
      reply_to: formData.email,
      message: formData.message,
      user_message: formData.message,
      to_name: "Tharusha Deneth",
    };

    let emailErrText = "";

    // Trigger EmailJS sending in parallel with the 3D cinematic animation
    const sendPromise = emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, {
        publicKey: PUBLIC_KEY,
      })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        emailErrText =
          err?.text ||
          err?.message ||
          "Could not establish connection with EmailJS service.";
        throw err;
      });

    // Step 2: Letter drops and slides into 3D envelope (at 900ms)
    const t1 = setTimeout(() => {
      setPhase("inserting");
    }, 900);

    // Step 3: Envelope flap closes and wax seal stamps (at 1750ms)
    const t2 = setTimeout(() => {
      setPhase("sealing");
    }, 1750);

    // Step 4: Envelope tilts and zooms into the distance / hyperspace (at 2550ms)
    const t3 = setTimeout(() => {
      setPhase("flying");
    }, 2550);

    // Step 5: Transition to Success (green celebration) or Error (at 3500ms)
    const t4 = setTimeout(async () => {
      try {
        await sendPromise;
        setPhase("success");
      } catch {
        setErrorMessage(emailErrText);
        setPhase("error");
      }
    }, 3500);

    timersRef.current = [t1, t2, t3, t4];
  };

  const handleReset = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    if (phase === "success") {
      // Clear form inputs on success
      setFormData({ name: "", email: "", message: "" });
    }
    // Return back to standard form
    setPhase("idle");
  };

  const isInView = useInView(ref, { margin: "-70px", once: false });

  return (
    <div
      className={`contact ${phase !== "idle" ? "envelope-active" : ""}`}
      ref={ref}
      id="contact"
    >
      {/* Background Backdrop Blur during active envelope animation and delivery states */}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            className="contact-backdrop-blur-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Dual Side Blur Wings */}
      <motion.div
        className="contact-side-blur contact-side-blur-left"
        initial={{ opacity: 1, scaleX: 1.3 }}
        animate={isInView ? { opacity: 0.25, scaleX: 0.7 } : { opacity: 1, scaleX: 1.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="contact-side-blur contact-side-blur-right"
        initial={{ opacity: 1, scaleX: 1.3 }}
        animate={isInView ? { opacity: 0.25, scaleX: 0.7 } : { opacity: 1, scaleX: 1.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Left Section - Interactive Form or 3D Envelope Journey */}
      <motion.div
        className="cSection cSectionLeft"
        variants={leftContactVariant}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        <AnimatePresence mode="wait">
          {phase === "idle" ? (
            <motion.form
              key="contact-form"
              ref={formRef}
              onSubmit={sendEmail}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: -15,
                filter: "blur(6px)",
                transition: { duration: 0.4 },
              }}
            >
              <motion.h1 variants={itemVariant} className="cTitle">
                Let&apos;s keep in touch
              </motion.h1>

              {/* Hidden inputs to support all EmailJS template variable names */}
              <input type="hidden" name="user_username" value={formData.name} />
              <input type="hidden" name="user_email" value={formData.email} />
              <input type="hidden" name="user_message" value={formData.message} />
              <input type="hidden" name="from_name" value={formData.name} />
              <input type="hidden" name="reply_to" value={formData.email} />

              <motion.div variants={itemVariant} className="formItem">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariant} className="formItem">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@gmail.com"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariant} className="formItem">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your message..."
                  required
                ></textarea>
              </motion.div>

              <motion.button
                variants={itemVariant}
                className="formButton"
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </motion.form>
          ) : (
            <EnvelopeAnimation
              key="envelope-journey"
              phase={phase}
              formData={formData}
              onReset={handleReset}
              errorMessage={errorMessage}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right Section - Illustration slides in from right and blurs when envelope animation is active */}
      <motion.div
        className="cSection cSectionRight"
        variants={rightContactVariant}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        style={{
          filter: phase !== "idle" ? "blur(22px)" : "blur(0px)",
          opacity: phase !== "idle" ? 0.2 : 1,
          transition: "filter 0.5s ease, opacity 0.5s ease",
        }}
      >
        <ContactSvg />
      </motion.div>
    </div>
  );
};

export default Contact;
