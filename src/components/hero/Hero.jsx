import { Canvas } from "@react-three/fiber";
import "./hero.css";
import Speech from "./Speech";
import { motion, useInView } from "motion/react";
import Shape from "./Shape";
import { Suspense, useRef } from "react";
import { TypeAnimation } from "react-type-animation";

// Scroll animation variants for left and right sides
const leftSideVariants = {
    initial: {
        x: -40,
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
            staggerChildren: 0.14,
        },
    },
};

const rightSideVariants = {
    initial: {
        x: 40,
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
            staggerChildren: 0.14,
        },
    },
};

const itemVariants = {
    initial: {
        y: 24,
        opacity: 0,
        filter: "blur(10px)",
    },
    animate: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const bgVariants = {
    initial: {
        scale: 0.92,
        opacity: 0,
        filter: "blur(20px)",
    },
    animate: {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const Hero = () => {
    const heroRef = useRef(null);
    const isInView = useInView(heroRef, { margin: "0px", once: false });

    return (
        <div 
            className="hero" 
            ref={heroRef}
        >
            {/* LEFT SIDE - Hidden to left & blurred, glides into place */}
            <motion.div 
                className="hSection left"
                variants={leftSideVariants}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
            >
                {/* TITLE */}
                <motion.h1
                    variants={itemVariants}
                    className="hTitle"
                >
                    Hey There,
                    <br />
                    <span>
                        I&apos;m{" "}
                        <span style={{ color: "white" }}>
                            <TypeAnimation
                                sequence={[
                                    "Tharusha!",
                                    1500,
                                    "Freelancer",
                                    1500,
                                    "Developer",
                                    1500,
                                ]}
                                wrapper="span"
                                speed={50}
                                deletionSpeed={50}
                                repeat={Infinity}
                            />
                        </span>
                    </span>
                </motion.h1>
                {/* AWARDS / ROLES */}
                <motion.div
                    variants={itemVariants}
                    className="awards"
                >
                    <h2>Full Stack Software Engineer</h2>
                    <p>
                        Undergraduate Software Engineering Student at Java Institute for Advanced Technology & IIC University.
                    </p>
                    <div className="awardList">
                        <img src="/award1.png" alt="Fiverr" />
                        <img src="/award2.png" alt="Dribbble" />
                        <img src="/award3.png" alt="Behance" />
                    </div>
                </motion.div>
                {/* SCROLL SVG */}
                <motion.a
                    variants={itemVariants}
                    animate={{ y: [0, 5, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{
                        repeat: Infinity,
                        duration: 2.4,
                        ease: "easeInOut",
                    }}
                    href="#skills"
                    className="scroll"
                >
                    <svg
                        width="30px"
                        height="42px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5 9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9Z"
                            stroke="white"
                            strokeWidth="1.2"
                        />
                        <motion.path
                            animate={{ y: [0, 4, 0] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.8,
                                ease: "easeInOut",
                            }}
                            d="M12 5V8"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </motion.a>
            </motion.div>

            {/* RIGHT SIDE */}
            <div className="hSection right">
                {/* FOLLOW */}
                <motion.div
                    variants={rightSideVariants}
                    initial="initial"
                    animate={isInView ? "animate" : "initial"}
                    className="follow"
                >
                    <a href="/">
                        <img src="/instagram.png" alt="" />
                    </a>
                    <a href="/">
                        <img src="/facebook.png" alt="" />
                    </a>
                    <a href="/">
                        <img src="/youtube.png" alt="" />
                    </a>
                    <div className="followTextContainer">
                        <div className="followText">FOLLOW ME</div>
                    </div>
                </motion.div>
                {/* BUBBLE - LOCKED IN PLACE, NO MOVING */}
                <div className="speechLockContainer">
                    <Speech />
                </div>
                {/* CERTIFICATE / BADGE */}
                <motion.div
                    variants={rightSideVariants}
                    initial="initial"
                    animate={isInView ? "animate" : "initial"}
                    className="certificate"
                >
                    <img src="/certificate.png" alt="" />
                    SOFTWARE ENGINEERING
                    <br />
                    UNDERGRADUATE
                    <br />
                    FULL STACK DEVELOPER
                </motion.div>
                {/* CONTACT BUTTON */}
                <motion.a
                    variants={rightSideVariants}
                    initial="initial"
                    animate={isInView ? "animate" : "initial"}
                    href="/#contact"
                    className="contactLink"
                >
                    <motion.div
                        className="contactButton"
                        animate={{ rotate: [0, 360] }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <svg viewBox="0 0 200 200" className="contactSvg">
                            <circle cx="100" cy="100" r="90" fill="#fba4bc" />
                            <path
                                id="innerCirclePath"
                                fill="none"
                                d="M 100,100 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                            />
                            <text className="circleText">
                                <textPath href="#innerCirclePath">Hire Now •</textPath>
                            </text>
                            <text className="circleText">
                                <textPath href="#innerCirclePath" startOffset="44%">
                                    Contact Me •
                                </textPath>
                            </text>
                        </svg>
                        <div className="arrow">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="arrowSvg"
                                fill="none"
                                stroke="black"
                                strokeWidth="2.4"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <polyline points="6 10 6 18 14 18" />
                            </svg>
                        </div>
                    </motion.div>
                </motion.a>
            </div>

            {/* CENTER BACKGROUND 3D & IMAGE */}
            <motion.div 
                className="bg"
                variants={bgVariants}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
            >
                {/* 3d */}
                <Canvas>
                    <Suspense fallback="loading...">
                        <Shape />
                    </Suspense>
                </Canvas>
                <div className="hImg">
                    <img src="/hero1.png" alt="" />
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;