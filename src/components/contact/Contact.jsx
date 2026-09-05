import "./contact.css";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import ContactSvg from "./ContactSvg";

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

// Success Pop-up eke animation eka
const popupVariant = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: "spring", stiffness: 200, damping: 15 } 
    },
    exit: { 
        opacity: 0, 
        scale: 0.8, 
        y: -20,
        transition: { duration: 0.3 }
    }
};

const Contact = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [isSending, setIsSending] = useState(false); // Send wena welawata button eka disable karanna

    const ref = useRef();
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();
        setIsSending(true);

        emailjs
            .sendForm(
                import.meta.env.VITE_SERVICE_ID,
                import.meta.env.VITE_TEMPLATE_ID,
                form.current,
                {
                    publicKey: import.meta.env.VITE_PUBLIC_KEY,
                }
            )
            .then(
                () => {
                    setSuccess(true);
                    setError(false);
                    setIsSending(false);
                    form.current.reset();
                    
                    setTimeout(() => setSuccess(false), 5000); 
                },
                (error) => {
                    console.log(error);
                    setError(true);
                    setSuccess(false);
                    setIsSending(false);
                    
                    setTimeout(() => setError(false), 5000);
                }
            );
    };

    const isInView = useInView(ref, { margin: "-70px", once: false });

    return (
        <div className="contact" ref={ref} id="contact">
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

            {/* Left Section - Form slides in from left hidden & blurred */}
            <motion.div 
                className="cSection cSectionLeft"
                variants={leftContactVariant}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
            >
                <form
                    ref={form}
                    onSubmit={sendEmail}
                >
                    <motion.h1 variants={itemVariant} className="cTitle">
                        Let&apos;s keep in touch
                    </motion.h1>

                    <motion.div variants={itemVariant} className="formItem">
                        <label>Name</label>
                        <input type="text" name="user_username" placeholder="John Doe" required />
                    </motion.div>

                    <motion.div variants={itemVariant} className="formItem">
                        <label>Email</label>
                        <input
                            type="email"
                            name="user_email"
                            placeholder="john@gmail.com"
                            required
                        />
                    </motion.div>

                    <motion.div variants={itemVariant} className="formItem">
                        <label>Message</label>
                        <textarea
                            rows={4}
                            name="user_message"
                            placeholder="Write your message..."
                            required
                        ></textarea>
                    </motion.div>

                    <motion.button 
                        variants={itemVariant} 
                        className="formButton" 
                        type="submit"
                        disabled={isSending}
                        style={{ opacity: isSending ? 0.7 : 1, cursor: isSending ? 'not-allowed' : 'pointer' }}
                    >
                        {isSending ? "Sending..." : "Send Message"}
                    </motion.button>

                    {/* LASSANA POPUP NOTIFICATIONS TIKA */}
                    <AnimatePresence>
                        {success && (
                            <motion.div 
                                className="successPopup"
                                variants={popupVariant}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                    border: '1px solid #4CAF50',
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    color: '#4CAF50',
                                    fontWeight: 'bold',
                                    marginTop: '10px'
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5"/>
                                </svg>
                                Message sent successfully!
                            </motion.div>
                        )}
                        
                        {error && (
                            <motion.div 
                                className="errorPopup"
                                variants={popupVariant}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                    border: '1px solid #F44336',
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    color: '#F44336',
                                    fontWeight: 'bold',
                                    marginTop: '10px'
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                Something went wrong! Please try again.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>

            {/* Right Section - Illustration slides in from right hidden & blurred */}
            <motion.div 
                className="cSection cSectionRight"
                variants={rightContactVariant}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
            >
                <ContactSvg />
            </motion.div>
        </div>
    );
};

export default Contact;